# Đáp án: ba log CI đỏ (bài 7.4, Bước 1)

> Mở sau khi đã điền **Bảng B**. Ba log có định dạng của `gh run view <id> --log-failed` (cột 1: job, cột 2:
> bước, cột 3: thời điểm). Nội dung được lấy từ **lần chạy thật ở máy khi soạn bài**, bọc lại theo định dạng log
> của GitHub Actions; riêng bước `env | sort` của log 3 là dữ liệu dựng cho bài tập (để có một khoá bị lộ).

| Log | Job › bước đỏ | Loại | Sai ở đâu | Dấu hiệu quyết định | Bấm "Re-run"? | Việc nên làm tiếp |
| --- | ------------- | ---- | --------- | ------------------- | ------------- | ----------------- |
| 1 | `e2e` › Gate e2e | **Lỗi code** | Test GH-4 `e2e/gio-hang/mien-phi-dung-nguong.spec.ts:19`: giỏ đúng 500.000 ₫ không thấy chữ "Miễn phí" | Đỏ ở lần đầu **và** `Retry #1`, cùng một lỗi, 13 test khác xanh | Không: chạy lại đã đỏ y hệt | Xem commit gần nhất đụng tới giỏ hàng (`cart-summary.tsx`), đối chiếu tiêu chí GH-4 (`>=` 500.000 ₫), sửa app, không sửa test |
| 2 | `e2e` › chạy bộ `e2e/tu-code` | **Test chập chờn** | `e2e/tu-code/sinh-tu-code.spec.ts:31`: sau `page.reload()` tiêu đề vẫn "Chờ xác nhận" | Cùng một test: `1 failed`, `1 flaky`, `1 passed`; lần đỏ mất 11-12 giây (hết thời gian chờ), lần xanh 0,8 giây | Không bấm để "lấy xanh": `--fail-on-flaky-tests` coi chập chờn là đỏ, xanh tình cờ chỉ che lỗi | Mở trace của lần đỏ; test đang chờ sai tín hiệu (nút "Xác nhận hủy" biến mất) nên tải lại trang trước khi server hủy xong (bài 6.5); chờ `waitForResponse` của lệnh PATCH, chạy `--repeat-each=20` để xác nhận |
| 3 | `unit` › Run npm ci | **Hạ tầng** | `https://npm-mirror.shoplite.internal/` không phân giải được tên (`ENOTFOUND`) | Đỏ ở bước cài đặt, **chưa tới** bước gate; mọi gói đều `ENOTFOUND`. Câu "This is an error with npm itself" là **nhiễu**: npm báo lỗi phụ sau khi mạng hỏng | Chưa: lỗi bền vững, chạy lại vẫn đỏ | Hỏi người quản lý mirror / sửa `NPM_CONFIG_REGISTRY`; sau khi cài được mới chạy lại để xem `unit` có lỗi thật nào phía sau không |

**Secret:** log 3 có bước debug `env | sort` in ra `SHIPPING_API_KEY` **nguyên văn** (GitHub chỉ tự che secret đã
khai báo trong repo, như `ANTHROPIC_API_KEY=***`). Sau khi `che-secret.mjs` chạy, log còn `[ĐÃ CHE: biến bí mật]`,
nhưng log gốc trên GitHub thì không. Việc phải làm theo thứ tự: **thu hồi và cấp lại khoá** ở nhà cung cấp → cập
nhật secret → xóa bước `env | sort` → xóa lượt chạy chứa log đó. Xóa log không làm khoá hết lộ.

Câu hỏi thêm: log nào có câu cố điều khiển AI? **Không log nào** trong ba log này. (Log có thể chứa chữ do người viết
PR đặt vào: tên test, thông báo lỗi, commit message. Bài 7.5 thử chuyện đó.)

## AI trả lời thế nào khi soạn bài

Prompt ở Bước 1 bài 7.4, chạy `claude -p ... --allowedTools "Read"` trên ba log đã che: 4 lượt, 71 giây, $0,24.
Phân loại đúng cả ba. Kết quả nguyên văn:

## Bảng chẩn đoán

| Log | Job › bước đỏ | Loại lỗi | Sai ở đâu | Bằng chứng từ log | Có nên bấm "Re-run"? | 3 việc nên làm tiếp |
|---|---|---|---|---|---|---|
| **log-1** | `e2e` › Gate e2e (`npx playwright test --retries=1 --fail-on-flaky-tests`) | **Lỗi code** | `e2e/gio-hang/mien-phi-dung-nguong.spec.ts:19:68`, test "GH-4 đúng 500.000đ: miễn phí giao hàng ở giỏ hàng và trang thanh toán". Không thấy chữ "Miễn phí" trong khung "Tóm tắt đơn hàng". | `Locator: …filter({ hasText: 'Tóm tắt đơn hàng' }).getByText('Miễn phí', { exact: true })` → `Error: element(s) not found`. Lần đầu và `Retry #1` đều đỏ cùng một lỗi, mỗi lần mất ~11s (hết timeout 10s). 13 test còn lại xanh. | **Không.** Chạy lại đã đỏ y hệt (cả lượt đầu lẫn retry), nên chạy thêm chỉ tốn thời gian. | 1. Mở `trace.zip`, ảnh chụp và `error-context.md` của test này để xem dòng phí giao hàng đang hiện chữ gì ở đúng mốc 500.000đ (`show-trace` đã có trong log). 2. Đọc code tính và hiển thị phí giao hàng ở tóm tắt giỏ hàng, kiểm tra mốc "đúng 500.000đ" (`>=` hay `>`) và nhãn hiển thị, rồi sửa code theo yêu cầu GH-4. Chỉ sửa test nếu đối chiếu yêu cầu thấy test sai, không nới cho xanh. 3. Chạy lại riêng spec này ở máy cục bộ, rồi chạy cả bộ e2e trước khi push. |
| **log-2** | `e2e` › `npx playwright test e2e/tu-code --retries=1 --fail-on-flaky-tests --repeat-each=3` | **Test chập chờn**. Có thể che một lỗi code là race giữa giao diện và lưu dữ liệu. | `e2e/tu-code/sinh-tu-code.spec.ts:31:59`, test "hủy đơn rồi tải lại trang thì thấy Đã hủy". Sau `page.reload()` (dòng 30), tiêu đề vẫn là "Chờ xác nhận". | `Expected substring: "Đã hủy"` / `Received string: "Đơn hàng SL-20261023-4D4740Chờ xác nhận"`. Ba lượt lặp cho kết quả khác nhau: `1 failed, 1 flaky, 1 passed`. Lượt đỏ mất 11–12s, lượt xanh chỉ ~0,8s. | **Không bấm chỉ để lấy xanh.** Cờ `--fail-on-flaky-tests` đã coi chập chờn là đỏ, và re-run tình cờ xanh sẽ che mất lỗi. Muốn lấy thêm dữ liệu thì chạy lặp nhiều lần. | 1. Mở trace của lượt đỏ (`…-repeat1/trace.zip`) và xem request hủy đơn đã xong chưa khi `reload` chạy. Dòng 29 chỉ chờ nút "Xác nhận hủy" biến mất (trạng thái trên giao diện), chưa chờ server lưu xong. 2. Sửa tận gốc. Nếu giao diện báo "Đã hủy" trước khi server lưu thì sửa app, vì người dùng cũng có thể gặp. Nếu app đúng thì cho test chờ phản hồi hủy đơn thành công trước khi reload (`waitForResponse`). Không thêm retry, không tắt cờ flaky, không xóa test. 3. Chạy lặp (ví dụ `--repeat-each=20`) cục bộ rồi trên CI để xác nhận hết chập chờn. |
| **log-3** | `unit` › Run npm ci | **Hạ tầng** (mạng/registry). Có thể là cấu hình nếu runner không bao giờ với tới host nội bộ này. | URL `https://npm-mirror.shoplite.internal/` (do `NPM_CONFIG_REGISTRY` trỏ tới). Không phân giải được tên miền. | `npm http fetch GET https://npm-mirror.shoplite.internal/zod/-/zod-4.6.7.tgz attempt 2 failed with ENOTFOUND`. Mọi gói đều lỗi ENOTFOUND ở cả lần thử 1 và 2, rồi `npm error Exit handler never called!`. Đỏ trước khi chạy tới test. | **Chưa.** ENOTFOUND đồng loạt ở mọi gói là lỗi bền vững, không phải chập chờn. Chỉ bấm sau khi xác nhận mirror và DNS đã hoạt động. | 1. Hỏi chủ của `npm-mirror.shoplite.internal`: mirror còn sống không, và runner này (GitHub-hosted, `/home/runner`) có với tới host `.internal` không. Có thể cần self-hosted runner hoặc VPN. 2. Tìm nơi đặt `NPM_CONFIG_REGISTRY` (workflow, biến repo hoặc runner) và xem gần đây có đổi không. Nếu chính sách cho phép, tạm trỏ về registry công khai. 3. Sau khi cài đặt chạy được mới re-run để xem `unit` có test đỏ nào bị che phía sau không. Đồng thời xóa bước debug `env \| sort` (xem phần dưới). |

## Log nào có dấu hiệu từng lộ secret?

**Log-3.** Bước `Debug: in biến môi trường` chạy `env | sort` và in thẳng biến môi trường vào log.

- **`SHIPPING_API_KEY`** là rủi ro cao nhất. Trong log nó hiện là `[ĐÃ CHE: biến bí mật]`, một dấu che khác với `***` mà GitHub tự đặt cho `ANTHROPIC_API_KEY`. Điều này gợi ý GitHub không che nó tại nguồn, và ai đó che sau khi tải log. Đây là suy luận từ hai dấu che khác nhau, không phải điều log nói thẳng. Nếu đúng, giá trị thật từng nằm nguyên văn trong log gốc trên GitHub.
- **`ANTHROPIC_API_KEY`** hiện `***`, tức GitHub đã che nên bằng chứng lộ yếu hơn. Nhưng biến này không có trong khối `env:` của bước, nên nó đến từ nơi khác (môi trường runner chăng?). Cần kiểm tra xem job này có thật sự cần khóa đó không.
- Run này là `refs/pull/1/merge` (PR). Nếu PR có thể sửa workflow thì người ngoài có thể bắt workflow in secret ra.

Người trong nhóm nên làm theo thứ tự này:

1. **Thu hồi và cấp lại `SHIPPING_API_KEY`** ngay ở nhà cung cấp, rồi cập nhật secret mới trong GitHub. Coi khóa cũ là đã lộ, kể cả khi log đã che.
2. **Xem lịch sử gọi API của khóa cũ** tại nhà cung cấp, từ khoảng 15:17 UTC ngày 2026-10-23, để tìm lệnh gọi lạ.
3. **Xóa bước `env | sort`** khỏi workflow. Xóa log run này và các bản đã tải về hoặc dán đi đâu đó, nhưng việc xóa không hoàn tác được phơi nhiễm vì log có thể đã được lưu đệm hoặc sao chép.
4. **Cân nhắc cấp lại `ANTHROPIC_API_KEY`** như biện pháp phòng ngừa rẻ. Đồng thời kiểm tra nó được nạp vào runner từ đâu, và chỉ để job nào thật sự cần nó dùng.
5. **Rà quyền PR:** secret có bị đưa cho PR từ fork hoặc từ người ngoài không. Với `unit` không cần khóa này thì không nên cấp cho nó.

Log-1 và log-2 không có dấu hiệu lộ secret. Trong cả ba log tôi không thấy câu nào là chỉ dẫn, nên chỉ coi là dữ liệu.
