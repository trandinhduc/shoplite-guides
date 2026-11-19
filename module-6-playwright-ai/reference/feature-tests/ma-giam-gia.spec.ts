// VÍ DỤ MINH HỌA cho bài 6.6 - tính năng Mã giảm giá (Module 2, nhánh lab2-speckit).
// Chưa chạy trên code của bạn: nhãn ô nhập, nút, câu thông báo, tên trường `couponCode` lấy theo brief
// (module-2-speckit/reference/feature-brief-coupon.md). Đổi cho khớp spec.md/plan.md của bạn.
// Đặt file vào e2e/ma-giam-gia/ và thêm các tiêu chí MG-1..MG-5 vào specs/tieu-chi.md.
//
// Kỹ thuật Playwright dùng ở đây (ngoài click/fill):
//   - custom fixture `coupon` dựng trên fixture `shop` có sẵn       (test.extend)
//   - test theo bảng dữ liệu: một vòng for sinh nhiều test           (data-driven)
//   - giả lập server trả lỗi lúc đặt hàng                           (page.route + route.fulfill)
//   - gọi API trực tiếp để thử gian lận                              (fixture request)
//   - tải lại trang để kiểm mã còn giữ                               (page.reload)
//   - chia bước có tên trong báo cáo/trace                           (test.step)
import { test as base, expect, KHACH_MAU } from "../fixtures";

interface CouponHelpers {
  /** Gõ mã vào ô mã giảm giá ở trang thanh toán và bấm "Áp dụng". */
  apply(code: string): Promise<void>;
}

const test = base.extend<{ coupon: CouponHelpers }>({
  coupon: async ({ page }, provide) => {
    await provide({
      async apply(code) {
        await page.getByLabel("Mã giảm giá").fill(code);
        await page.getByRole("button", { name: "Áp dụng" }).click();
      },
    });
  },
});

// Bảng lấy từ "Thử thủ công" của bài 2.5 - mỗi dòng thành một test riêng, có tag riêng.
const CASES = [
  {
    tag: "@MG-1",
    title: "SHOPLITE10 trên đơn 1.290.000đ: giảm chạm trần 100.000đ",
    cart: [{ slug: "tai-nghe-khong-day-soundmax-pro", quantity: 1 }],
    code: "SHOPLITE10",
    expectText: /100\.000/,
  },
  {
    tag: "@MG-1",
    title: "GIAM50K trên đơn 1.890.000đ: giảm 50.000đ",
    cart: [{ slug: "ban-phim-co-keypro-75", quantity: 1 }],
    code: "GIAM50K",
    expectText: /50\.000/,
  },
  {
    tag: "@MG-2",
    title: "SHOPLITE10 trên đơn 150.000đ: báo cần mua thêm 150.000đ",
    cart: [{ slug: "cap-usb-c-ben-du-2m", quantity: 1 }],
    code: "SHOPLITE10",
    expectText: /mua thêm 150\.000/i,
  },
  {
    tag: "@MG-2",
    title: "TET2026: báo mã đã hết hạn",
    cart: [{ slug: "cap-usb-c-ben-du-2m", quantity: 1 }],
    code: "TET2026",
    expectText: /hết hạn/i,
  },
  {
    tag: "@MG-2",
    title: "KHONGCO: báo mã không tồn tại",
    cart: [{ slug: "cap-usb-c-ben-du-2m", quantity: 1 }],
    code: "KHONGCO",
    expectText: /không tồn tại/i,
  },
];

test.describe("Mã giảm giá", () => {
  for (const c of CASES) {
    test(c.title, { tag: c.tag }, async ({ page, shop, coupon }) => {
      for (const line of c.cart) await shop.addToCart(line.slug, line.quantity);
      await page.goto("/checkout");
      await coupon.apply(c.code);
      await expect(page.getByText(c.expectText).first()).toBeVisible();
    });
  }

  test(
    "mã đã áp dụng vẫn còn sau khi tải lại trang",
    { tag: "@MG-3" },
    async ({ page, shop, coupon }) => {
      await shop.addToCart("tai-nghe-khong-day-soundmax-pro");
      await page.goto("/checkout");
      await coupon.apply("SHOPLITE10");
      await expect(page.getByTestId("checkout-total")).toHaveText("1.190.000 ₫");

      await page.reload();
      await expect(page.getByTestId("checkout-total")).toHaveText("1.190.000 ₫");
    },
  );

  test(
    "server từ chối mã lúc đặt hàng: báo lỗi, không chuyển trang, giỏ còn nguyên",
    { tag: "@MG-4" },
    async ({ page, shop, coupon }) => {
      await shop.addToCart("tai-nghe-khong-day-soundmax-pro");
      await page.goto("/checkout");
      await shop.fillCheckout();
      await coupon.apply("SHOPLITE10");

      await test.step("giả lập: mã vừa hết hạn đúng lúc bấm đặt hàng", async () => {
        // Khó tái hiện thật (phải chờ tới 23:59:59 ngày hết hạn) nên chặn request và trả lời thay server.
        await page.route("**/api/orders", (route) =>
          route.request().method() === "POST"
            ? route.fulfill({
                status: 422,
                json: { error: { code: "COUPON_EXPIRED", message: "Mã giảm giá đã hết hạn" } },
              })
            : route.continue(),
        );
      });

      await page.getByRole("button", { name: "Đặt hàng" }).click();
      await expect(page.getByRole("alert")).toContainText("Mã giảm giá đã hết hạn");
      await expect(page).toHaveURL(/\/checkout$/);
      await expect(page.getByRole("link", { name: "Giỏ hàng (1 sản phẩm)" })).toBeVisible();
    },
  );

  test(
    "gian lận: gửi discount và total giả qua API bị từ chối",
    { tag: "@MG-5" },
    async ({ request }) => {
      // Đơn 150.000đ chưa đạt tối thiểu 300.000đ của SHOPLITE10 - server không được tin discount/total.
      const response = await request.post("/api/orders", {
        data: {
          customer: KHACH_MAU,
          shippingMethod: "standard",
          paymentMethod: "cod",
          items: [{ productId: "p010", quantity: 1 }],
          couponCode: "SHOPLITE10",
          discount: 150_000,
          total: 0,
        },
      });
      expect(response.ok()).toBe(false);
      expect(response.status()).toBeGreaterThanOrEqual(400);
    },
  );
});
