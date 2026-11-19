# 3 ý tưởng cho Module 4 - 5 (BMAD)

> Khác với brief của Module 2 (mã giảm giá) và Module 3 (wishlist) vốn đã viết sẵn yêu cầu, ở đây mỗi ý
> tưởng chỉ là **một đoạn ý tưởng thô**, cố ý mơ hồ. Việc của sinh viên là dùng BMAD để biến nó thành
> brief → PRD → UX → kiến trúc → epic/story. Mỗi nhóm chọn **một** ý tưởng.

| #   | Ý tưởng                          | Góc nhìn chính                       | Độ lớn   | Gợi ý cho              |
| --- | -------------------------------- | ------------------------------------ | -------- | ---------------------- |
| A   | ShopLite Ops - vận hành đơn hàng | Nghiệp vụ, kiến trúc, đồng thời      | 3-4 epic | **Mặc định** cho lớp   |
| B   | Tra cứu đơn hàng riêng tư        | Bảo mật, quyền riêng tư              | 3 epic   | Nhóm thích security    |
| C   | Flash Sale giờ vàng              | Marketing, UX, quy tắc giá/thời gian | 3 epic   | Nhóm thích UX/sản phẩm |

Cả 3 ý tưởng đều chạm vào "nợ kỹ thuật cố ý" trong [FEATURE-BACKLOG.md](../../FEATURE-BACKLOG.md) mục 3,
nên các agent của BMAD có thứ thật để phát hiện khi đọc code.

---

## Ý tưởng A - ShopLite Ops: nhân viên xử lý đơn hàng (khuyến nghị)

### Ý tưởng thô để dán vào `/bmad-brainstorming`

```text
ShopLite hiện chỉ có phía khách hàng. Đơn đặt xong nằm mãi ở "Chờ xác nhận": cửa hàng không có chỗ nào để
xác nhận, giao hàng hay đánh dấu đã giao, và tồn kho trên web không bao giờ giảm dù đã bán. Chúng tôi muốn
một công cụ nhỏ cho nhân viên cửa hàng để vận hành đơn hàng hằng ngày, và khách hàng nhìn thấy đơn của mình
đang đi tới đâu. Hãy giúp chúng tôi nghĩ xem công cụ này nên làm gì, cho ai, và cái gì là quan trọng nhất.
```

### Ghi chú cho giảng viên

**Hiện trạng trong code** (để sinh viên/agent tự phát hiện, đừng nói trước):

| Hiện trạng                                                                                         | File                                                           |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `ORDER_STATUSES` có `confirmed/shipping/delivered` nhưng không có luồng chuyển                     | `src/features/orders/types.ts`                                 |
| `PATCH /api/orders/:id` chỉ nhận `{ "status": "cancelled" }`                                       | `src/app/api/orders/[id]/route.ts`                             |
| Kiểm tra tồn kho khi đặt nhưng **không trừ kho**; tồn kho là dữ liệu tĩnh                          | `src/features/orders/order-service.ts`, `src/data/products.ts` |
| Repository đọc - sửa - ghi cả file JSON, dùng chung một file `.tmp` → ghi đồng thời có thể mất đơn | `src/features/orders/order-repository.ts`                      |
| Không có đăng nhập; chỉ có `updatedAt`, không có lịch sử trạng thái                                | `src/app/orders/page.tsx`, `src/features/orders/types.ts`      |

**Câu hỏi BMAD nên khơi ra** (brainstorm / party mode / PRD):

1. Ai dùng công cụ? (nhân viên kho, CSKH, chủ shop) - có cần phân quyền không hay một mật khẩu chung là đủ?
2. Máy trạng thái: `pending → confirmed → shipping → delivered`; hủy được ở bước nào, ai được hủy?
   Quy tắc cũ "khách chỉ hủy khi `pending`" **phải giữ nguyên**.
3. Trừ kho lúc nào: khi khách đặt (giữ hàng) hay khi nhân viên xác nhận? Hoàn kho khi hủy ở bước nào?
4. Tồn kho đang nằm trong file `.ts` tĩnh → cần nơi lưu ghi được (ví dụ `storage/inventory.json`) mà
   catalog vẫn đọc được. Hai đơn đặt cùng lúc sản phẩm chỉ còn 1 cái thì sao?
5. Lịch sử trạng thái (ai, lúc nào, ghi chú) → đơn cũ trong `orders.json` chưa có trường này: migrate thế nào?
6. Bảo vệ trang quản trị không cần dịch vụ ngoài: biến môi trường + cookie ký HMAC, kiểm tra ở
   `src/proxy.ts` (Next.js 16 đổi `middleware` thành `proxy`) hay trong từng route?

**Gợi ý epic** (để đối chiếu với kết quả `bmad-create-epics-and-stories`):

| Epic | Nội dung                                                                                                    | Làm ở Module 5 |
| ---- | ----------------------------------------------------------------------------------------------------------- | -------------- |
| 1    | Vòng đời đơn hàng: máy trạng thái (hàm thuần), lịch sử trạng thái, API chuyển trạng thái                    | ✅ bắt buộc    |
| 2    | Trang vận hành `/admin/orders`: danh sách, lọc theo trạng thái, thao tác chuyển trạng thái, bảo vệ truy cập | tùy chọn       |
| 3    | Tồn kho thật: trừ kho, hoàn kho khi hủy, chống bán vượt tồn kho khi đặt đồng thời                           | ✅ story 3.1   |
| 4    | Khách xem tiến trình đơn (timeline) ở `/orders/[id]`                                                        | tùy chọn       |

**Vì sao hợp với bài code review ở Module 5:** máy trạng thái có nhiều trường hợp biên (chuyển ngược,
chuyển nhảy bước, hủy đơn đã giao), trừ/hoàn kho dễ sai lệch số lượng, ghi file đồng thời dễ mất dữ liệu,
và route admin dễ bị quên kiểm tra quyền - đúng những thứ 4 lớp review của `bmad-code-review` được thiết
kế để bắt.

---

## Ý tưởng B - Tra cứu đơn hàng riêng tư, không cần tài khoản

### Ý tưởng thô để dán vào `/bmad-brainstorming`

```text
Bất kỳ ai mở trang /orders của ShopLite đều thấy danh sách đơn hàng của mọi khách, bấm vào là xem được họ tên, số điện thoại, địa chỉ.
Chúng tôi chưa muốn bắt khách tạo tài khoản, nhưng mỗi người chỉ được thấy đơn của chính mình, và có cách để
khách tra cứu lại đơn khi đổi máy hoặc xóa trình duyệt. Hãy giúp chúng tôi nghĩ ra trải nghiệm vừa an toàn
vừa đơn giản cho khách.
```

### Ghi chú cho giảng viên

**Hiện trạng:** `GET /api/orders` và trang `/orders` trả về toàn bộ đơn; `/orders/[id]` và
`GET /api/orders/:id` chỉ cần biết mã đơn (dạng `SL-YYYYMMDD-XXXXXX`, ngày đoán được, 6 ký tự hex còn lại
có thể dò); `PATCH` hủy đơn cũng chỉ cần mã đơn → ai biết mã là hủy được đơn của người khác.

**Câu hỏi BMAD nên khơi ra:** "đơn của tôi" dựa trên thiết bị (localStorage lưu mã đơn + token) hay số
điện thoại? Tra cứu bằng mã đơn + số điện thoại có bị dò không (rate limit, thông báo lỗi chung chung)?
Che bớt thông tin cá nhân (`091****678`)? Đơn cũ không có token thì sao? Kịch bản e2e
`shopping-flow.spec.ts` đang mong đơn vừa đặt hiện ở `/orders` - phải giữ được.

**Gợi ý epic:** (1) token truy cập cho từng đơn + bảo vệ trang/API chi tiết và hủy đơn;
(2) "Đơn của tôi trên thiết bị này"; (3) tra cứu bằng mã đơn + số điện thoại có giới hạn số lần thử.
Module 5 làm epic 1.

**Bẫy cho code review:** so sánh token không an toàn về thời gian, token lộ qua URL/Referer, rate limit
lưu trong bộ nhớ một tiến trình, quên bảo vệ `PATCH`, lỗi khác nhau giữa "sai mã" và "sai số điện thoại"
(lộ thông tin), danh sách `/api/orders` vẫn mở.

---

## Ý tưởng C - Flash Sale "Giờ vàng giá sốc"

### Ý tưởng thô để dán vào `/bmad-brainstorming`

```text
Marketing muốn chạy "Giờ vàng giá sốc": mỗi ngày vài sản phẩm được giảm giá mạnh trong một khung giờ ngắn,
số suất có hạn, để kéo khách quay lại ShopLite thường xuyên. Khách phải cảm nhận được sự gấp gáp nhưng không
bị lừa (giá hiển thị phải đúng giá khi thanh toán). Hãy giúp chúng tôi nghĩ ra cách làm hấp dẫn mà vẫn công
bằng và không làm cửa hàng lỗ.
```

### Ghi chú cho giảng viên

**Hiện trạng:** giỏ hàng lưu **snapshot giá** lúc thêm vào giỏ (`src/features/cart/types.ts`) trong khi
server tính lại giá từ catalog khi đặt (`order-service.ts`) → khi sale kết thúc giữa chừng, giá trong giỏ
khác giá thật. `Product` đã có `originalPrice` để hiển thị giá gạch. Tồn kho tĩnh nên "số suất có hạn" cần
nơi lưu ghi được.

**Câu hỏi BMAD nên khơi ra:** khung giờ theo múi giờ Việt Nam, đúng phút kết thúc thì tính giá nào? Giới hạn
mỗi đơn mấy suất? Hết suất giữa lúc khách đang thanh toán? Có cộng dồn với mã giảm giá (Module 2) không?
Ngưỡng miễn phí ship tính trên giá sale? Countdown trên server-render và client lệch giờ? Cấu hình sale ở
đâu (file dữ liệu, không làm trang admin)?

**Gợi ý epic:** (1) cấu hình sale + quy tắc giá theo thời gian (hàm thuần, inject `now()` như
`order-service`); (2) giao diện: nhãn sale, đồng hồ đếm ngược, trang `/flash-sale`; (3) thanh toán & đơn
hàng: server áp giá sale, đếm suất, báo khách khi giá trong giỏ đã đổi. Module 5 làm epic 1 và story 3.1.

**Bẫy cho code review:** so sánh thời gian bằng chuỗi/sai múi giờ, biên `<` và `<=` ở phút kết thúc, tin
giá client gửi lên, đếm suất không nguyên tử, test phụ thuộc giờ thật (không inject `now`).
