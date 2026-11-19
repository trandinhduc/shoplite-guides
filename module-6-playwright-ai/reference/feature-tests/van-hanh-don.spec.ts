// VÍ DỤ MINH HỌA cho bài 6.6 - ý tưởng A "ShopLite Ops" (Module 4-5, nhánh lab5-build), story 1.1-1.3.
// Chưa chạy trên code của bạn: route, body, mã lỗi lấy theo epics-example-ops.md. Đổi cho khớp
// epics.md và spec của story trong _bmad-output/ của bạn.
// Đặt file vào e2e/van-hanh/ và thêm các tiêu chí VH-1..VH-4 vào specs/tieu-chi.md.
//
// Cần biến môi trường ở CẢ HAI phía (xem bài 5.1 bước 5):
//   - dev server đọc STAFF_API_KEY từ .env.local
//   - tiến trình test đọc process.env.STAFF_API_KEY:  STAFF_API_KEY=dev-staff-key-123 npx playwright test e2e/van-hanh
//
// Kỹ thuật Playwright dùng ở đây (ngoài click/fill):
//   - API context riêng mang header xác thực                          (playwright.request.newContext)
//   - test theo ma trận chuyển trạng thái                               (data-driven)
//   - bỏ qua có điều kiện, có lý do rõ                                  (test.skip(điều kiện, lý do))
//   - kết hợp API (nhân viên) + giao diện (khách)                       (request + page)
import type { APIRequestContext } from "@playwright/test";
import { test, expect, createPendingOrder } from "../fixtures";

const STAFF_KEY = process.env.STAFF_API_KEY;

test.describe("Vận hành đơn hàng (API nhân viên)", () => {
  test.skip(!STAFF_KEY, "Chưa đặt STAFF_API_KEY cho tiến trình test");

  let staff: APIRequestContext;
  test.beforeAll(async ({ playwright, baseURL }) => {
    staff = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: { Authorization: `Bearer ${STAFF_KEY}` },
    });
  });
  test.afterAll(async () => {
    await staff.dispose();
  });

  // Ma trận rút gọn: [từ chuỗi bước chuẩn bị] → [đích] → [mã HTTP mong đợi]
  const MATRIX = [
    { steps: [], to: "confirmed", status: 200, tag: "@VH-1" },
    { steps: [], to: "delivered", status: 409, tag: "@VH-1" },
    { steps: ["confirmed", "shipping", "delivered"], to: "cancelled", status: 409, tag: "@VH-1" },
    { steps: ["cancelled"], to: "confirmed", status: 409, tag: "@VH-1" },
  ] as const;

  for (const row of MATRIX) {
    const from = row.steps.at(-1) ?? "pending";
    test(`${from} → ${row.to} trả ${row.status}`, { tag: row.tag }, async ({ request }) => {
      const id = await createPendingOrder(request);
      for (const step of row.steps) {
        expect(
          (await staff.patch(`/api/admin/orders/${id}`, { data: { status: step } })).ok(),
        ).toBe(true);
      }
      const response = await staff.patch(`/api/admin/orders/${id}`, { data: { status: row.to } });
      expect(response.status()).toBe(row.status);
    });
  }

  test("không có khóa hoặc sai khóa: 401, đơn không đổi", { tag: "@VH-2" }, async ({ request }) => {
    const id = await createPendingOrder(request);
    const noKey = await request.patch(`/api/admin/orders/${id}`, { data: { status: "confirmed" } });
    expect(noKey.status()).toBe(401);
    const wrongKey = await request.patch(`/api/admin/orders/${id}`, {
      data: { status: "confirmed" },
      headers: { Authorization: "Bearer khoa-sai" },
    });
    expect(wrongKey.status()).toBe(401);
    expect(await (await request.get(`/api/orders/${id}`)).json()).toMatchObject({
      status: "pending",
    });
  });

  test(
    "nhân viên xác nhận đơn: khách thấy 'Đã xác nhận' và không còn nút hủy",
    { tag: "@VH-3" },
    async ({ page, request }) => {
      const id = await createPendingOrder(request);
      expect(
        (
          await staff.patch(`/api/admin/orders/${id}`, {
            data: { status: "confirmed", note: "Đã kiểm hàng" },
          })
        ).ok(),
      ).toBe(true);

      await page.goto(`/orders/${id}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Đã xác nhận");
      await expect(page.getByRole("button", { name: "Hủy đơn hàng" })).toHaveCount(0);
    },
  );

  test("lịch sử trạng thái ghi đủ người làm và ghi chú", { tag: "@VH-4" }, async ({ request }) => {
    const id = await createPendingOrder(request);
    const response = await staff.patch(`/api/admin/orders/${id}`, {
      data: { status: "confirmed", note: "Đã kiểm hàng" },
    });
    expect(await response.json()).toMatchObject({
      statusHistory: [
        { status: "pending", actor: "customer" },
        { status: "confirmed", note: "Đã kiểm hàng" },
      ],
    });
  });
});
