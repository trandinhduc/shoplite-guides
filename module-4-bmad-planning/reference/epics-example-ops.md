---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-shoplite-ops-2026-10-22/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-shoplite-ops-2026-10-22/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-shoplite-ops-2026-10-22/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-shoplite-ops-2026-10-22/EXPERIENCE.md
---

<!--
ĐÁP ÁN THAM KHẢO cho ý tưởng A (ShopLite Ops) - rút gọn. Kết quả thật của sinh viên sẽ khác về câu chữ,
số FR và số story; điều cần đối chiếu là CẤU TRÚC:
- epic theo giá trị người dùng, không theo tầng kỹ thuật
- không epic nào phụ thuộc epic phía sau (API ở Epic 1 tự bảo vệ, không chờ đăng nhập ở Epic 2)
- tiêu đề "## Epic N:" / "### Story N.M:" giữ tiếng Anh để sprint_plan.py đọc được
- AC có trường hợp lỗi/biên và trỏ tới AD-n của architecture spine
Chỉ các story của Sprint 1 (1.1, 1.2, 1.3, 3.1) được viết đầy đủ AC.
-->

# ShopLite Ops - Epic Breakdown

## Overview

Nhân viên cửa hàng vận hành đơn hàng (xác nhận, giao, hủy), tồn kho phản ánh hàng thật, khách thấy đơn
của mình đang ở bước nào. Không thêm database, không dịch vụ ngoài; dữ liệu vẫn lưu trong `storage/`.

## Requirements Inventory

### Functional Requirements

- FR-1: Hệ thống chỉ cho phép các chuyển trạng thái hợp lệ: `pending → confirmed | cancelled`,
  `confirmed → shipping | cancelled`, `shipping → delivered`; `delivered` và `cancelled` là trạng thái cuối.
- FR-2: Khách hàng chỉ hủy được đơn `pending` (giữ nguyên hành vi hiện có).
- FR-3: Mỗi lần đổi trạng thái được ghi lịch sử: trạng thái, thời điểm, người thực hiện, ghi chú.
- FR-4: Nhân viên đổi trạng thái đơn qua API được bảo vệ.
- FR-5: Nhân viên đăng nhập vào trang vận hành bằng mật khẩu cửa hàng.
- FR-6: Nhân viên xem danh sách đơn, lọc theo trạng thái, xem chi tiết và thao tác chuyển trạng thái.
- FR-7: Xác nhận đơn trừ tồn kho; hủy đơn đã xác nhận hoàn lại tồn kho.
- FR-8: Catalog, trang chi tiết và giỏ hàng hiển thị tồn kho thật.
- FR-9: Khách xem tiến trình đơn (timeline) ở trang chi tiết đơn.

### NonFunctional Requirements

- NFR-1: Hai thao tác ghi đồng thời không làm mất dữ liệu đơn hàng hay tồn kho.
- NFR-2: Thiếu cấu hình bí mật (biến môi trường) thì API/trang nhân viên **từ chối** truy cập (fail-closed).
- NFR-3: Đơn cũ trong `storage/orders.json` (chưa có lịch sử) vẫn hiển thị và thao tác được.

### Additional Requirements

- Từ spine: AD-3 (mọi đổi trạng thái qua `transitionOrder`), AD-4 (tuần tự hóa thao tác ghi file),
  AD-5 (`InventoryRepository` riêng, `storage/inventory.json`, giá trị khởi tạo lấy từ `src/data/products.ts`),
  AD-6 (bảo vệ `/admin/*` bằng `src/proxy.ts` + cookie ký HMAC; `/api/admin/*` kiểm tra trong route).

### UX Design Requirements

- UX-DR1: Badge trạng thái dùng lại `OrderStatusBadge`, kèm chữ (không chỉ màu).
- UX-DR2: Nút chuyển trạng thái chỉ hiện các bước hợp lệ tiếp theo; hủy đơn cần xác nhận lần hai.

### FR Coverage Map

- FR-1: Epic 1 - Story 1.1
- FR-2: Epic 1 - Story 1.1
- FR-3: Epic 1 - Story 1.2
- FR-4: Epic 1 - Story 1.3
- FR-5: Epic 2 - Story 2.1
- FR-6: Epic 2 - Story 2.2, 2.3
- FR-7: Epic 3 - Story 3.1
- FR-8: Epic 3 - Story 3.2
- FR-9: Epic 4 - Story 4.1

## Epic List

### Epic 1: Vòng đời đơn hàng có kiểm soát

**FRs covered:** FR-1, FR-2, FR-3, FR-4

### Epic 2: Trang vận hành cho nhân viên

**FRs covered:** FR-5, FR-6

### Epic 3: Tồn kho thật

**FRs covered:** FR-7, FR-8

### Epic 4: Khách theo dõi tiến trình đơn

**FRs covered:** FR-9

---

## Epic 1: Vòng đời đơn hàng có kiểm soát

Mục tiêu: đơn đi qua các trạng thái hợp lệ, có lịch sử, nhân viên đổi được trạng thái qua API an toàn.

### Story 1.1: Máy trạng thái đơn hàng

As a nhân viên cửa hàng,
I want hệ thống chỉ cho phép các bước chuyển trạng thái hợp lệ,
So that đơn không bị nhảy cóc, quay ngược hay "sống lại" sau khi hủy.

Ràng buộc: AD-3 - hàm thuần `transitionOrder(order, to, actor, now)` trong
`src/features/orders/order-state-machine.ts`; `cancelOrder` hiện có phải dùng lại hàm này.

**Acceptance Criteria:**

**Given** đơn `pending`
**When** nhân viên chuyển sang `confirmed`
**Then** đơn có `status: confirmed` và `updatedAt` = thời điểm chuyển

**Given** đơn `pending`
**When** chuyển sang `shipping` hoặc `delivered`
**Then** bị từ chối với `OrderError("INVALID_STATUS_TRANSITION", ...)`
**And** đơn không thay đổi

**Given** đơn `delivered` hoặc `cancelled`
**When** chuyển sang bất kỳ trạng thái nào
**Then** bị từ chối với `INVALID_STATUS_TRANSITION`

**Given** đơn `confirmed`
**When** **khách hàng** gọi hủy đơn
**Then** bị từ chối (khách chỉ hủy được đơn `pending` - FR-2)

**Given** toàn bộ ma trận 5 × 5 trạng thái
**Then** có unit test cho từng cặp (hợp lệ và không hợp lệ)

### Story 1.2: Lịch sử trạng thái đơn

As a nhân viên cửa hàng,
I want thấy ai đã đổi trạng thái đơn, lúc nào, kèm ghi chú,
So that tôi giải thích được với khách khi có khiếu nại.

Ràng buộc: AD-3, NFR-3.

**Acceptance Criteria:**

**Given** khách vừa đặt đơn
**Then** `statusHistory` có đúng 1 mục `{ status: "pending", at: createdAt, actor: "customer" }`

**Given** một lần chuyển trạng thái hợp lệ có ghi chú
**Then** `statusHistory` có thêm đúng 1 mục với `status`, `at`, `actor`, `note`
**And** thứ tự các mục là thứ tự thời gian

**Given** đơn cũ trong `storage/orders.json` không có `statusHistory`
**When** đọc đơn
**Then** lịch sử được suy ra là `[{ status: <trạng thái hiện tại>, at: createdAt }]`
**And** file không bị ghi lại chỉ vì một lần đọc

**Given** ghi chú dài hơn 200 ký tự
**Then** bị từ chối với `VALIDATION_ERROR`

### Story 1.3: API chuyển trạng thái cho nhân viên

As a nhân viên cửa hàng,
I want gọi API để đổi trạng thái đơn,
So that trang vận hành (Epic 2) và công cụ khác dùng chung một quy tắc.

Ràng buộc: AD-3, AD-6, NFR-2. `PATCH /api/admin/orders/:id`, body `{ status, note? }` validate bằng Zod,
xác thực bằng header `Authorization: Bearer <STAFF_API_KEY>`.

**Acceptance Criteria:**

**Given** header đúng khóa và chuyển hợp lệ
**Then** trả 200 với đơn đã cập nhật (gồm `statusHistory`)

**Given** thiếu header, sai khóa, hoặc **biến môi trường `STAFF_API_KEY` chưa được đặt**
**Then** trả 401 `{ error: { code: "UNAUTHORIZED", ... } }` và không đọc/ghi đơn nào

**Given** chuyển không hợp lệ
**Then** trả 409 `INVALID_STATUS_TRANSITION`

**Given** mã đơn không tồn tại
**Then** trả 404 `ORDER_NOT_FOUND`

**Given** body không phải JSON hoặc `status` không thuộc `ORDER_STATUSES`
**Then** trả 400 `VALIDATION_ERROR`

**Given** `PATCH /api/orders/:id` hiện có của khách
**Then** hành vi giữ nguyên (chỉ `{ "status": "cancelled" }`, chỉ khi `pending`)

---

## Epic 2: Trang vận hành cho nhân viên

Mục tiêu: nhân viên làm việc hằng ngày trên giao diện, không cần gọi API bằng tay.

### Story 2.1: Đăng nhập nhân viên

Mật khẩu cửa hàng từ biến môi trường → cookie HttpOnly ký HMAC; `src/proxy.ts` chặn `/admin/*` khi chưa đăng nhập.

### Story 2.2: Danh sách đơn cho nhân viên

`/admin/orders`: lọc theo trạng thái (URL-driven như `/products`), đơn `pending` lâu nhất lên đầu.

### Story 2.3: Chi tiết đơn và thao tác chuyển trạng thái

Chỉ hiện nút cho bước hợp lệ tiếp theo (UX-DR2), hủy cần xác nhận, nhập ghi chú, hiển thị lịch sử.

---

## Epic 3: Tồn kho thật

Mục tiêu: số tồn kho trên web khớp hàng thật trong kho.

### Story 3.1: Trừ kho khi xác nhận, hoàn kho khi hủy

As a chủ cửa hàng,
I want tồn kho giảm khi đơn được xác nhận và tăng lại khi đơn đã xác nhận bị hủy,
So that web không bán món hàng đã hết.

Ràng buộc: AD-4, AD-5, NFR-1. `InventoryRepository` (`storage/inventory.json`), giá trị khởi tạo lấy từ
`src/data/products.ts` khi file chưa có; mọi thao tác đọc-sửa-ghi đi qua hàng đợi tuần tự.

**Acceptance Criteria:**

**Given** sản phẩm còn 5, đơn `pending` có 2 sản phẩm đó
**When** nhân viên xác nhận đơn
**Then** tồn kho còn 3

**Given** sản phẩm còn 1, đơn cần 2
**When** xác nhận
**Then** bị từ chối với `INSUFFICIENT_STOCK`, đơn vẫn `pending`, tồn kho không đổi

**Given** đơn `confirmed` có 2 sản phẩm
**When** hủy đơn
**Then** tồn kho tăng lại 2

**Given** đơn `pending` (chưa từng trừ kho)
**When** hủy đơn
**Then** tồn kho **không** thay đổi

**Given** hai yêu cầu xác nhận hai đơn khác nhau cùng lúc cho sản phẩm còn 1, mỗi đơn cần 1
**Then** đúng một đơn được xác nhận, đơn còn lại nhận `INSUFFICIENT_STOCK`, tồn kho = 0 (không âm)

### Story 3.2: Hiển thị tồn kho thật

Catalog, trang chi tiết, `StockBadge`, giới hạn số lượng trong giỏ đọc tồn kho thật thay cho `products.ts`.

---

## Epic 4: Khách theo dõi tiến trình đơn

### Story 4.1: Timeline trạng thái ở trang chi tiết đơn

`/orders/[id]` hiển thị các bước đã qua kèm thời điểm, bước hiện tại nổi bật; đơn hủy hiển thị lý do nếu có.
