# Báo cáo Module 6 - <Họ tên / nhóm>

> Chép file này vào `specs/bao-cao.md` trong repo ShopLite của bạn và điền dần qua các bài.
> Nộp cùng nhánh `lab6-e2e` (và nhánh tính năng ở bài 6.6).

## Bảng A - Duyệt kế hoạch (bài 6.4)

Mỗi tiêu chí một dòng. Cột "Kịch bản" ghi số mục trong `specs/*.plan.md` (ví dụ `1.6`).

| Tiêu chí | Kịch bản phủ | Đủ chưa? (biên / lỗi / đường đẹp) | Đã bổ sung gì |
| -------- | ------------ | --------------------------------- | ------------- |
| GH-1     |              |                                   |               |
| GH-2     |              |                                   |               |
| GH-3     |              |                                   |               |
| GH-4     |              |                                   |               |
| DH-1     |              |                                   |               |
| DH-2     |              |                                   |               |
| DH-3     |              |                                   |               |

Kịch bản planner **tự nghĩ ra** (không thuộc tiêu chí nào): ... → giữ / bỏ, vì sao: ...

## Bảng B - Duyệt bản vá của healer (bài 6.4, 6.5)

| #   | Test | Healer đã sửa gì (tóm tắt diff) | Dấu hiệu từ chối? (1-4, xem checklist) | Chấp nhận / Từ chối | Lý do |
| --- | ---- | ------------------------------- | -------------------------------------- | ------------------- | ----- |
| 1   |      |                                 |                                        |                     |       |

## Bảng C - Đọc màu đỏ (bài 6.5)

| Test đỏ | Action hỏng (số trong trace) | Màn hình lúc hỏng | API trả gì | Theo tiêu chí: test sai hay app sai? | Bằng chứng |
| ------- | ---------------------------- | ----------------- | ---------- | ------------------------------------ | ---------- |
|         |                              |                   |            |                                      |            |

Vì sao các test còn lại **vẫn xanh** là đúng: ...

## Bảng D - Chấm chất lượng bộ test (bài 6.4 và 6.6)

Chấm theo checklist `lab-guides/module-6-playwright-ai/reference/checklist-chat-luong-test.md`
(mỗi mục 0 hoặc 1).

| Mục                          | Bộ test giỏ hàng + đặt hàng | Bộ test tính năng cũ (6.6) |
| ---------------------------- | --------------------------- | -------------------------- |
| 1. Truy được về tiêu chí     |                             |                            |
| 2. Kỳ vọng lấy từ tiêu chí   |                             |                            |
| 3. Locator như người dùng    |                             |                            |
| 4. Có kiểm kết quả           |                             |                            |
| 5. Chờ đúng cách             |                             |                            |
| 6. Độc lập                   |                             |                            |
| 7. Ổn định (xanh 3 lần)      |                             |                            |
| 8. Có trường hợp xấu         |                             |                            |
| 9. Đỏ đúng chỗ               |                             |                            |
| 10. Dễ đọc, `npm run check`  |                             |                            |
| **Tổng**                     |                             |                            |

## Phản tư

1. Bao nhiêu kịch bản planner viết khớp tiêu chí mà không cần sửa? Kịch bản nào nó tự nghĩ ra?
2. Test nào chập chờn ở lần chạy 3 lần đầu tiên? Nguyên nhân ở test hay ở app?
3. Khi áp hai bản vá lỗi, vì sao test GH-1..GH-3, DH-1, DH-2 vẫn xanh là **đúng**?
4. Nếu CI tự chạy healer mỗi khi build đỏ, hai lỗi ở bài 6.5 sẽ ra sao?
