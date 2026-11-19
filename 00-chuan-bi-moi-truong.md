# Bài 0 - Chuẩn bị môi trường

**Thời lượng:** 20 phút (nên làm trước buổi học) · **Kết quả:** ShopLite chạy được trên máy, các CLI đã cài.

## 1. Cài công cụ

| Công cụ           | macOS / Linux                                                                          | Windows (PowerShell)                                                                  | Kiểm tra             |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------- |
| Node.js 22.12+    | <https://nodejs.org> hoặc `fnm install 22`                                             | <https://nodejs.org> hoặc `winget install OpenJS.NodeJS.LTS`                          | `node -v`            |
| Git               | `brew install git` / có sẵn                                                            | `winget install Git.Git`                                                              | `git --version`      |
| Claude Code       | `curl -fsSL https://claude.ai/install.sh \| bash`                                      | `irm https://claude.ai/install.ps1 \| iex`                                            | `claude --version`   |
| uv (cho Spec Kit) | `curl -LsSf https://astral.sh/uv/install.sh \| sh`                                     | `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 \| iex"` | `uv --version`       |
| Spec Kit          | `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.2.2` | (giống macOS)                                                                         | `specify version`    |
| OpenSpec          | `npm install -g @fission-ai/openspec@latest`                                           | (giống macOS)                                                                         | `openspec --version` |

Ghi chú:

- Claude Code cũng cài được bằng npm: `npm install -g @anthropic-ai/claude-code`. Lần đầu chạy
  `claude` sẽ yêu cầu đăng nhập (tài khoản Claude Pro/Max/Team hoặc API key Console).
- Spec Kit cần Python 3.11+ (uv tự tải nếu máy chưa có). Có thể cài bản mới nhất từ PyPI:
  `uv tool install specify-cli`. Nếu máy đã có bản cũ: `uv tool install --force specify-cli ...`.
- OpenSpec gửi thống kê ẩn danh. Tắt bằng biến môi trường `OPENSPEC_TELEMETRY=0`.
- Windows: dùng Git Bash hoặc PowerShell đều được. Claude Code trên Windows dùng Git Bash nếu có.

## 2. Lấy mã nguồn ShopLite

Giảng viên cung cấp link repo (hoặc file zip). Ví dụ:

```bash
git clone <link-repo-shoplite> shoplite
cd shoplite
```

Nếu nhận file zip: giải nén, `cd shoplite`, rồi tạo repo git để theo dõi thay đổi:

```bash
git init
git add -A
git commit -m "chore: baseline ShopLite"
```

## 3. Cài đặt và chạy thử

```bash
npm install
npm run dev          # mở http://localhost:3000
```

Mở terminal thứ hai, chạy bộ kiểm tra chất lượng:

```bash
npm run check        # lint + typecheck + 83 unit/component test
```

(Tùy chọn) cài trình duyệt cho test end-to-end rồi chạy thử:

```bash
npx playwright install chromium
npm run test:e2e     # 2 kịch bản mua hàng
```

✅ **Checkpoint:** trang chủ hiển thị; `npm run check` báo `Tests 83 passed`.

## 4. Dạo một vòng ShopLite (10 phút)

Hiểu ứng dụng trước khi để AI sửa nó. Hãy tự làm và ghi chú lại:

1. Trang **Sản phẩm**: tìm `ban phim` (không dấu) - vẫn ra "Bàn phím cơ KeyPro 75%".
2. Lọc danh mục _Âm thanh_, tick _Chỉ hiện hàng còn_, sắp xếp _Giá thấp → cao_. Để ý URL thay đổi.
3. Mở **Micro thu âm PodCast USB** - sản phẩm hết hàng, không mua được.
4. Thêm **Cáp USB-C** vào giỏ: giỏ báo "Mua thêm ... để được miễn phí giao hàng". Tăng số lượng
   đến khi tạm tính ≥ 500.000 ₫ - phí ship về 0.
5. **Thanh toán**: bấm _Đặt hàng_ khi form trống - xem thông báo lỗi. Điền đúng và đặt hàng.
6. **Đơn hàng**: mở đơn vừa tạo, thử _Hủy đơn hàng_.
7. Mở `storage/orders.json` - đây là "database" của dự án.

Câu hỏi suy nghĩ: _nếu là người mới vào dự án, bạn mất bao lâu để biết quy tắc miễn phí giao hàng
nằm ở file nào?_ Bài 1.1 sẽ giúp AI agent trả lời câu này ngay lập tức.

## 5. Khởi động Claude Code lần đầu

```bash
cd shoplite
claude
```

- Chọn **Trust this folder** khi được hỏi (hook và allow-rule của dự án chỉ có hiệu lực sau bước này).
- Gõ `/help` để xem lệnh, `/status` để xem phiên bản và tài khoản. Thoát bằng `/exit` hoặc `Ctrl+C` hai lần.
- Quan sát thanh trạng thái phía dưới: nó cho biết **permission mode** hiện tại (bài 1.2 sẽ dùng).
