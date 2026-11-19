# Ví dụ finding điển hình và cách sửa (ý tưởng A, Sprint 1)

> **Ví dụ minh họa** - tổng hợp từ các lỗi AI hay mắc khi làm story 1.1-1.3 và 3.1 của
> [epics-example-ops.md](../../module-4-bmad-planning/reference/epics-example-ops.md). Code của bạn sẽ khác;
> dùng file này để **đối chiếu cách suy nghĩ**: lỗi gì, lớp nào hay bắt, sửa ra sao, test nào chứng minh.

| #   | Lớp phát hiện                          | Verdict | Bucket              | Lỗi                                                                 |
| --- | -------------------------------------- | ------- | ------------------- | ------------------------------------------------------------------- |
| F1  | Blind Hunter                           | high    | patch               | API nhân viên cho qua khi chưa cấu hình khóa (fail-open)            |
| F2  | Edge Case Hunter                       | medium  | patch               | Chuyển sang chính trạng thái hiện tại: ghi lịch sử và trừ kho 2 lần |
| F3  | Acceptance Auditor                     | high    | patch               | Hủy đơn `pending` vẫn hoàn kho (vi phạm AC story 3.1)               |
| F4  | Verification Gap - missing adoption    | medium  | patch               | Luồng khách hủy đơn cũ không đi qua máy trạng thái mới              |
| F5  | Verification Gap - broken verification | medium  | patch               | Test "đồng thời" chạy tuần tự nên không kiểm chứng gì               |
| F6  | Edge Case Hunter                       | medium  | **defer**           | File tạm `orders.json.tmp` dùng chung - có từ trước story           |
| F7  | Acceptance Auditor                     | medium  | **decision_needed** | Thiếu hàng khi xác nhận: từ chối cả đơn hay xác nhận một phần?      |
| F8  | Blind Hunter                           | false   | _rejected_          | "Thiếu chống CSRF" cho API dùng header `Authorization`              |

---

## F1 - Fail-open khi thiếu biến môi trường (Blind Hunter, high)

```ts
// ❌ src/app/api/admin/orders/[id]/route.ts
const authorization = request.headers.get("authorization");
if (authorization !== `Bearer ${process.env.STAFF_API_KEY}`) {
  return jsonError(401, "UNAUTHORIZED", "Không có quyền truy cập");
}
```

**Tái hiện:** chạy server **không** có `STAFF_API_KEY`, gửi header `Authorization: Bearer undefined` →
chuỗi mong đợi cũng là `"Bearer undefined"` → qua cửa. Ngoài ra `!==` so sánh chuỗi không an toàn về thời gian.

**Sửa:** đưa logic về feature (route chỉ mỏng - quy ước trong `AGENTS.md`), fail-closed, so sánh timing-safe.

```ts
// ✅ src/features/orders/staff-auth.ts
import { timingSafeEqual } from "node:crypto";

/** Chưa cấu hình khóa thì không ai qua được (fail-closed). */
export function isStaffAuthorized(
  header: string | null,
  expectedKey = process.env.STAFF_API_KEY,
): boolean {
  if (!expectedKey || !header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(expectedKey);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
```

```ts
// ✅ src/features/orders/staff-auth.test.ts
import { afterEach, expect, it, vi } from "vitest";
import { isStaffAuthorized } from "./staff-auth";

afterEach(() => vi.unstubAllEnvs());

it("từ chối khi server chưa cấu hình khóa, kể cả header 'Bearer undefined'", () => {
  vi.stubEnv("STAFF_API_KEY", "");
  expect(isStaffAuthorized("Bearer undefined")).toBe(false);
  expect(isStaffAuthorized("Bearer ")).toBe(false);
});

it("chấp nhận đúng khóa, từ chối khóa sai cùng độ dài", () => {
  vi.stubEnv("STAFF_API_KEY", "dev-staff-key-123");
  expect(isStaffAuthorized("Bearer dev-staff-key-123")).toBe(true);
  expect(isStaffAuthorized("Bearer dev-staff-key-124")).toBe(false);
});
```

(Gọi `isStaffAuthorized(header, undefined)` **không** kiểm tra được trường hợp "chưa cấu hình": truyền
`undefined` sẽ kích hoạt giá trị mặc định và đọc lại biến môi trường. Vì vậy test dùng `vi.stubEnv`.)

## F2 - Chuyển trạng thái "giữ nguyên" (Edge Case Hunter, medium)

```ts
// ❌ src/features/orders/order-state-machine.ts
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  // "cho idempotent để nhân viên bấm 2 lần không bị lỗi"
  return from === to || ALLOWED_TRANSITIONS[from].includes(to);
}
```

**Hậu quả:** nhân viên bấm "Xác nhận" 2 lần → `transitionOrder` vẫn chạy: `statusHistory` thêm mục trùng, và
ở story 3.1 **tồn kho bị trừ 2 lần**. Edge Case Hunter tìm ra vì nó liệt kê mọi nhánh, gồm nhánh `from === to`.

**Sửa:** không coi `from === to` là chuyển hợp lệ; nút bấm 2 lần nhận 409 và UI hiển thị trạng thái mới.

```ts
// ✅
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
```

```ts
// ✅ test
// inventory = createInMemoryInventoryRepository({ p005: 5 }); order: 2 × p005, trạng thái pending
it("xác nhận đơn lần thứ hai bị từ chối và chỉ trừ kho một lần", async () => {
  await service.updateStatus(order.id, "confirmed", staff);
  await expect(service.updateStatus(order.id, "confirmed", staff)).rejects.toMatchObject({
    code: "INVALID_STATUS_TRANSITION",
  });
  expect(await inventory.getStock("p005")).toBe(3);
});
```

## F3 - Hoàn kho cho đơn chưa từng trừ kho (Acceptance Auditor, high)

```ts
// ❌ src/features/orders/order-service.ts
if (to === "cancelled") {
  await inventory.restock(order.items);
}
```

**Vì sao chỉ Acceptance Auditor bắt được:** nhìn riêng diff thì đoạn này "hợp lý". Phải đọc AC của story 3.1
(_"Given đơn `pending`... When hủy... Then tồn kho **không** thay đổi"_) mới thấy sai. Đây là giá trị của lớp
có đọc spec.

```ts
// ✅ chỉ hoàn kho khi đơn đã từng bị trừ kho
if (to === "cancelled" && order.status === "confirmed") {
  await inventory.restock(order.items);
}
```

Test: hủy đơn `pending` → `getStock` không đổi; hủy đơn `confirmed` → tăng lại đúng số lượng.

## F4 - Code mới không được dùng ở luồng cũ (Verification Gap - missing adoption, medium)

Story 1.1 thêm `transitionOrder` và story 1.2 thêm `statusHistory`, nhưng `cancelOrder` (khách tự hủy, có
từ trước) vẫn tự gán trạng thái:

```ts
// ❌ order-service.ts - cancelOrder không được cập nhật
const cancelled: Order = { ...order, status: "cancelled", updatedAt: now().toISOString() };
```

**Hậu quả:** đơn khách tự hủy không có dòng lịch sử; mọi test cũ vẫn xanh nên không ai thấy. Verification
Gap tìm ra vì nó tìm **mọi nơi** đổi `status` trong repo, không chỉ trong diff.

```ts
// ✅
const cancelled = transitionOrder(order, "cancelled", "customer", now());
```

Test: sau khi khách hủy, mục cuối của `statusHistory` có `status: "cancelled"`, `actor: "customer"`.

## F5 - Test không kiểm chứng điều nó tuyên bố (Verification Gap - broken verification, medium)

```ts
// ❌ "hai yêu cầu xác nhận cùng lúc" - nhưng thực ra chạy lần lượt
it("không bán vượt tồn kho khi xác nhận đồng thời", async () => {
  await service.updateStatus(a.id, "confirmed", staff);
  await expect(service.updateStatus(b.id, "confirmed", staff)).rejects.toThrow();
});
```

Test xanh dù code **không** có cơ chế chống ghi đồng thời. Viết lại cho chạy đồng thời thật:

```ts
// ✅ inventory = createInMemoryInventoryRepository({ p011: 1 }); đơn a và b mỗi đơn cần 1 × p011
const results = await Promise.allSettled([
  service.updateStatus(a.id, "confirmed", staff),
  service.updateStatus(b.id, "confirmed", staff),
]);
expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
expect(await inventory.getStock("p011")).toBe(0); // không được âm
```

Test mới **fail** → sửa code: tuần tự hóa thao tác đọc-sửa-ghi (theo AD-4 của spine).

```ts
// ✅ src/features/orders/write-queue.ts
/**
 * Tuần tự hóa các thao tác đọc-sửa-ghi trong MỘT tiến trình Node.
 * Đủ cho lab; chạy nhiều instance cần database/lock thật (xem mục Deferred của spine).
 */
export function createWriteQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task, task);
    tail = run.catch(() => undefined);
    return run;
  };
}
```

Hai điều kiện để hàng đợi có tác dụng: mọi thao tác dùng **một** hàng đợi chung (một instance tạo cùng
`orderService` trong `server.ts` và truyền vào service, không tạo mới mỗi request); và hàng đợi bọc **cả**
đoạn đọc tồn kho → kiểm tra → trừ kho → lưu đơn, không chỉ bọc riêng lệnh ghi file.

## F6 - Lỗi có từ trước: file tạm dùng chung (defer)

`createJsonFileOrderRepository` luôn ghi vào `${filePath}.tmp` rồi `rename`. Hai lần ghi đồng thời dùng chung
một file tạm → có thể đè dữ liệu của nhau hoặc `rename` lỗi `ENOENT`. Lỗi **có từ trước** story này nên
triage xếp `defer` và ghi vào `deferred-work.md` - đúng: sửa lẫn vào story sẽ làm diff khó review. Hàng đợi
ghi ở F5 đã giảm rủi ro trong một tiến trình; sửa triệt để (tên file tạm duy nhất) nên là một story riêng.

## F7 - Cần người quyết định (decision_needed)

_"Đơn có 2 sản phẩm, một sản phẩm không đủ hàng khi xác nhận: từ chối cả đơn hay xác nhận phần đủ hàng?"_

Spec không nói → không có cách sửa "đúng" duy nhất → skill **không được tự chọn**. Trả lời dựa trên PRD
(_"đơn được xác nhận khi kho đủ hàng"_) → từ chối cả đơn với `INSUFFICIENT_STOCK`, đơn giữ `pending`. Câu
trả lời trở thành một patch. Nếu PRD cũng không nói: đó là lỗ hổng của PRD - ghi lại để sửa PRD
(`/bmad-prd` update hoặc `/bmad-correct-course`).

## F8 - Báo nhầm (rejected)

_"PATCH /api/admin/orders/:id thiếu chống CSRF."_ CSRF khai thác việc trình duyệt **tự gửi cookie**; API này
xác thực bằng header `Authorization` do client tự đặt, trình duyệt không tự gửi → không áp dụng. Triage
đúng sẽ ghi `false` kèm lý do vào phụ lục _Rejected_. (Lưu ý: khi làm Story 2.1 - đăng nhập bằng **cookie** -
CSRF lại trở thành vấn đề thật.)

---

## Bài học rút ra

- **Blind Hunter** mạnh ở lỗi "nhìn là thấy" (bảo mật, xử lý lỗi), nhưng cũng báo nhầm nhiều nhất vì không có ngữ cảnh.
- **Edge Case Hunter** mạnh ở nhánh/biên và ở việc đối chiếu commit message với hành vi thật.
- **Verification Gap** bắt lỗi mà cả code lẫn test đều "xanh": code mới chưa được dùng, test giả.
- **Acceptance Auditor** là lớp duy nhất biết code **đúng yêu cầu** hay chỉ **chạy được**.
- Không lớp nào thay được người ở `decision_needed` và ở việc từ chối finding nhầm.
