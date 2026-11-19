# Checklist chất lượng test case E2E

> Dùng để chấm bộ test do AI sinh ra (bài 6.4, 6.6) và để duyệt bản vá của healer (bài 6.4, 6.5).
> Mỗi mục đạt = 1 điểm. **Dưới 8/10 thì chưa nộp.** Mục 9 và 10 là hai mục quan trọng nhất: một bộ test
> xanh mà không đỏ khi app hỏng thì chỉ là trang trí.

## Phần 1 - Chấm một bộ test (10 điểm)

| #   | Tiêu chí                     | Đạt khi                                                                                                                                                                                                | Cách kiểm nhanh                                                                    |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1   | **Truy được về tiêu chí**    | Mỗi test có tag mã tiêu chí (`{ tag: "@GH-4" }`) và comment `// spec:` trỏ về kế hoạch. Mỗi tiêu chí có ít nhất một test.                                                                               | `npx playwright test --list --grep @GH-4`                                          |
| 2   | **Kỳ vọng lấy từ tiêu chí**  | Số liệu viết cứng theo tiêu chí (`"500.000 ₫"`), không tính lại bằng hàm của app (`formatCurrency(calculate...)`), không chép từ màn hình lúc app đang chạy.                                             | Đọc dòng `expect`: con số này lấy ở đâu ra?                                        |
| 3   | **Locator như người dùng**   | Ưu tiên `getByRole` → `getByLabel` → `getByText`; `getByTestId` khi không còn cách khác. Không CSS/XPath, không `nth()`/`first()` khi thứ tự không có nghĩa.                                              | Tìm `locator("`, `.nth(`, `.first()` trong file                                    |
| 4   | **Có kiểm kết quả**          | Mỗi test có ít nhất một `await expect(...)` cho thứ khách nhìn thấy sau hành động. Không có test chỉ bấm mà không kiểm.                                                                                 | Đếm `expect` trong từng test                                                       |
| 5   | **Chờ đúng cách**            | Chỉ dùng assertion tự chờ (`toBeVisible`, `toHaveText`...) hoặc `waitForResponse`. **Không** `waitForTimeout`, `force: true`, `networkidle`, `waitForLoadState`.                                       | `grep -nE "waitForTimeout\|force: true\|networkidle\|waitForLoadState" -r e2e`     |
| 6   | **Độc lập**                  | Chạy riêng từng test vẫn xanh; không dựa vào dữ liệu test khác tạo ra (đơn hàng lọc theo **mã đơn của chính nó**).                                                                                     | `npx playwright test <file>:<dòng>` cho vài test bất kỳ                            |
| 7   | **Ổn định**                  | Xanh 3 lần liên tiếp.                                                                                                                                                                                  | `npx playwright test --repeat-each=3`                                              |
| 8   | **Có trường hợp xấu**        | Mỗi luồng có test cho biên (đúng ngưỡng) và cho bị từ chối/lỗi, không chỉ đường đi đẹp.                                                                                                                | So với cột "Dữ liệu mẫu" của bộ tiêu chí                                           |
| 9   | **Đỏ đúng chỗ**              | Cài lỗi vi phạm tiêu chí X → test của X đỏ; test của tiêu chí khác vẫn xanh.                                                                                                                           | Bài 6.5: `git apply` bản vá lỗi rồi chạy lại                                       |
| 10  | **Dễ đọc, qua cổng chất lượng** | Tên test tiếng Việt mô tả hành vi; comment theo bước của kế hoạch; `npm run check` pass (lint + typecheck quét cả `e2e/`).                                                                         | `npm run check`                                                                    |

## Phần 2 - Duyệt bản vá của healer

Commit **trước** khi gọi healer, đọc `git diff` **trước** khi commit bản vá. Bốn dấu hiệu phải **từ chối**:

| #   | Dấu hiệu                                                                                     | Ví dụ trên ShopLite                                                                                       |
| --- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | Xóa một dòng `expect`, hoặc đổi chuỗi kỳ vọng cho khớp hành vi mới                            | `toHaveText("500.000 ₫")` thành `toHaveText("530.000 ₫")`; thêm `page.reload()` trước khi kiểm _Đã hủy_    |
| 2   | Thêm `waitForTimeout`, `force: true`, hoặc tăng `retries`                                     | `await page.waitForTimeout(2000)` trước khi bấm _Thêm vào giỏ_                                            |
| 3   | Đổi `getByRole`/`getByLabel` sang CSS selector                                                | `getByRole("button", { name: "Đặt hàng" })` thành `locator("form button[type=submit]")`                   |
| 4   | Thêm `test.skip` / `test.fixme` mà không có phiếu lỗi                                         | `test.fixme(...)` cho GH-4 mà không ai báo lỗi phí giao hàng                                              |

Được **chấp nhận** khi: giao diện đổi **có chủ ý** (có commit/yêu cầu đổi nhãn) và healer chỉ cập nhật
locator; hoặc test chờ sai tín hiệu và healer đổi sang chờ đúng tín hiệu (ví dụ `waitForResponse` của lệnh
`PATCH`).

> Hướng dẫn của healer (file `.claude/agents/playwright-test-healer.md`) dặn nó: _"Do not ask user
> questions… do the most reasonable thing possible to pass the test."_ Nó **luôn** tự quyết để test xanh.
> Vì vậy không bao giờ cho healer tự sửa trong CI - ở đó không ai đọc diff, và build đỏ là tín hiệu duy nhất.
> Quy trình đúng: CI đỏ → dev chạy healer trên máy → bản vá vào pull request → người khác duyệt.

## Phần 3 - Chấm một tiêu chí chấp nhận (dùng ở bài 6.1)

Một tiêu chí tốt cho E2E:

- **Nhìn thấy được:** nói về thứ khách thấy hoặc làm, không nói tên hàm, tên biến.
- **Có số:** "tổng 500.000 ₫", không phải "tổng đúng".
- **Một ý:** tách "thêm vào giỏ" và "giới hạn tồn kho" thành hai tiêu chí.
- **Có nguồn:** README, AGENTS.md, spec của tính năng, hay chỉ suy ra từ code (⚠️ cần người xác nhận).
- **Không mô tả cách làm:** "miễn phí giao hàng khi đủ 500.000 ₫", không phải "dùng `>=` trong `pricing.ts`".
