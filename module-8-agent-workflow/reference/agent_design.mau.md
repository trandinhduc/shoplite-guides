# Bản thiết kế: <tên agent>

> Một trang. Viết trước khi dựng. Chép vào `.claude/evals/<tên>/agent_design.md`.

## 1. Tên agent

Chữ thường, số, gạch nối. Trùng tên thư mục skill hoặc tên file subagent.

## 2. Việc

Đúng một việc, một câu. Ai đang làm tay, bao lâu một lần, mỗi lần mất bao lâu.

## 3. Kích hoạt

Người gõ lệnh, lịch (giờ UTC), hay lệnh gọi từ xa.

## 4. Đầu vào

Dữ liệu ở đâu, lấy qua script, MCP hay lệnh nào. Dữ liệu nào do người khác viết (không tin được).

## 5. Đầu ra theo mẫu

Ra đâu (màn hình, Release nháp, hàng chờ), theo mẫu nào. Dán mẫu hoặc trỏ tới file mẫu.

## 6. Công cụ được phép

Danh sách đóng. Mỗi dòng một loại: `doc:`, `ghi:`, `lenh:`, `mcp:`, `web:`. `lenh:` viết đúng đầu lệnh cần, không
viết `lenh: gh`. Không cần gì thì đừng ghi dòng đó.

```cong-cu
lenh: <đầu lệnh>
doc: <đường dẫn>
mcp: <server>/<công cụ>
```

## 7. Giới hạn mỗi lần chạy

Tối đa bao nhiêu lượt, bao nhiêu USD, bao nhiêu phút. Phải khớp `--max-turns`, `--max-budget-usd`, `timeout-minutes`.

## 8. Khi nào dừng

Dừng và báo trong những trường hợp nào, thay vì đoán.

## 9. Lúc nào hỏi người

Việc gì agent không tự quyết. Ai duyệt. Duyệt ở đâu.

## 10. Đo kết quả

Năm ca thử: bình thường, biên, dữ liệu bảo AI làm khác, dữ liệu cá nhân, phải nhường người. Ca nào khó nhất, vì sao.

## 11. Người soát

Ai soát, đã hỏi gì, đã sửa gì sau khi soát.
