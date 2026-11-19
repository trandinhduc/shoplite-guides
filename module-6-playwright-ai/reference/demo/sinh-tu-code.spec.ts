// BỘ TEST "SINH TỪ CODE" - chỉ dùng cho cảnh so sánh của demo, không đưa vào bộ test thật.
// Cách nó ra đời: agent được bảo "đọc cart-summary.tsx và cancel-order-button.tsx rồi viết E2E",
// lúc code ĐÃ có lỗi của bug-1 và bug-2. Không ai đưa cho nó specs/tieu-chi.md.
// Kỳ vọng vì vậy chép theo hành vi hiện tại của code, kể cả hành vi sai.
import { test, expect } from "../fixtures";

test.describe("Sinh từ code", () => {
  test("giỏ dưới ngưỡng cộng phí 30.000đ", async ({ page, shop }) => {
    await shop.addToCart("cap-usb-c-ben-du-2m");
    await page.goto("/cart");
    await expect(page.getByTestId("cart-total")).toHaveText("180.000 ₫");
  });

  test("giỏ 500.000đ chưa vượt ngưỡng nên vẫn cộng phí 30.000đ", async ({ page, shop }) => {
    // Code: freeShipping = subtotal > FREE_SHIPPING_THRESHOLD
    await shop.addToCart("ban-di-chuot-deskmat-xl", 2);
    await page.goto("/cart");
    await expect(page.getByTestId("cart-total")).toHaveText("530.000 ₫");
  });

  test("hủy đơn rồi tải lại trang thì thấy Đã hủy", async ({ page, shop }) => {
    // Code: sau khi PATCH thành công chỉ đóng hộp xác nhận, nên test tải lại trang để thấy trạng thái mới
    await shop.addToCart("cap-usb-c-ben-du-2m");
    await page.goto("/checkout");
    await shop.fillCheckout();
    await shop.placeOrder();
    await page.getByRole("button", { name: "Hủy đơn hàng" }).click();
    await page.getByRole("button", { name: "Xác nhận hủy" }).click();
    await expect(page.getByRole("button", { name: "Xác nhận hủy" })).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Đã hủy");
  });
});
