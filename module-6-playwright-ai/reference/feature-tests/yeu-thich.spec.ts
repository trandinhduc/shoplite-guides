// VÍ DỤ MINH HỌA cho bài 6.6 - tính năng Danh sách yêu thích (Module 3, nhánh lab3-openspec).
// Chưa chạy trên code của bạn: tên nút trái tim, khóa localStorage, câu thông báo lấy theo brief
// (module-3-openspec/reference/feature-brief-wishlist.md). Đổi cho khớp openspec/specs của bạn.
// Đặt file vào e2e/yeu-thich/ và thêm các tiêu chí YT-1..YT-4 vào specs/tieu-chi.md.
//
// Kỹ thuật Playwright dùng ở đây (ngoài click/fill):
//   - mở tab thứ hai trong cùng phiên trình duyệt                    (context.newPage)
//   - tải lại trang để kiểm dữ liệu còn giữ                           (page.reload)
//   - kiểm trạng thái cho screen reader                               (toHaveAttribute aria-pressed)
//   - chuẩn bị 50 sản phẩm yêu thích trước khi trang chạy             (page.addInitScript)
//   - thao tác bằng bàn phím                                          (locator.focus + keyboard.press)
import { test, expect } from "../fixtures";

// Khóa localStorage: đọc trong code wishlist của bạn (ví dụ src/features/wishlist/wishlist-store.ts).
const WISHLIST_KEY = "shoplite:wishlist";

test.describe("Danh sách yêu thích", () => {
  test(
    "thích ở tab này, tab kia thấy ngay; tải lại vẫn còn",
    { tag: "@YT-1" },
    async ({ page, context }) => {
      await page.goto("/products/chuot-khong-day-swiftclick");
      const heart = page.getByRole("button", { name: /yêu thích/i });
      await heart.click();
      await expect(heart).toHaveAttribute("aria-pressed", "true");

      const secondTab = await context.newPage();
      await secondTab.goto("/wishlist");
      await expect(secondTab.getByText("Chuột không dây SwiftClick")).toBeVisible();

      await page.reload();
      await expect(page.getByRole("button", { name: /yêu thích/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    },
  );

  test("bỏ thích bằng bàn phím", { tag: "@YT-2" }, async ({ page }) => {
    await page.goto("/products/chuot-khong-day-swiftclick");
    const heart = page.getByRole("button", { name: /yêu thích/i });
    await heart.focus();
    await page.keyboard.press("Enter");
    await expect(heart).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(heart).toHaveAttribute("aria-pressed", "false");
  });

  test("đủ 50 sản phẩm thì báo đầy, không thêm được nữa", { tag: "@YT-3" }, async ({ page }) => {
    // Catalog chỉ có 16 sản phẩm - không thể bấm đủ 50 lần trên giao diện.
    // Chuẩn bị dữ liệu trước khi trang chạy; định dạng phải khớp đúng định dạng store của bạn đọc.
    // ⚠️ Nếu store lọc bỏ id không có trong catalog (ghi chú giảng viên Module 3 khuyên làm vậy), 34 id
    // giả p017..p050 sẽ bị bỏ và test này KHÔNG còn kiểm được giới hạn. Khi đó giới hạn 50 là việc của unit
    // test reducer: xóa test này và ghi vào mục "Cố ý không đưa vào E2E" của specs/tieu-chi.md.
    await page.addInitScript(
      ([key, ids]) => window.localStorage.setItem(key, JSON.stringify(ids)),
      [
        WISHLIST_KEY,
        Array.from({ length: 50 }, (_, i) => `p${String(i + 1).padStart(3, "0")}`),
      ] as const,
    );
    await page.goto("/products/robot-hut-bui-cleanbot-x1");
    await page.getByRole("button", { name: /yêu thích/i }).click();
    await expect(page.getByText(/tối đa 50/i)).toBeVisible();
  });

  test(
    "sản phẩm hết hàng vẫn nằm trong danh sách nhưng không thêm vào giỏ được",
    { tag: "@YT-4" },
    async ({ page }) => {
      await page.goto("/products/micro-thu-am-podcast-usb");
      await page.getByRole("button", { name: /yêu thích/i }).click();
      await page.goto("/wishlist");
      const item = page.getByRole("listitem").filter({ hasText: "Micro thu âm PodCast USB" });
      await expect(item.getByText("Hết hàng")).toBeVisible();
      await expect(item.getByRole("button", { name: /Thêm vào giỏ|Hết hàng/ })).toBeDisabled();
    },
  );
});
