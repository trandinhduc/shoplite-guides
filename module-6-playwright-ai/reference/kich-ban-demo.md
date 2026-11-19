# Kịch bản demo Module 6 (giảng viên, ~20 phút)

> Năm cảnh chạy thật (cảnh 6 làm nếu dư giờ), một cảnh so sánh làm sẵn. Bám theo slide _"Demo của giảng
> viên"_ và _"Cùng một lỗi, hai bộ test"_. Mọi lệnh chạy trong một bản ShopLite **riêng cho demo** (không dùng repo sinh viên).

## Chuẩn bị trước giờ học (15')

```bash
# 1. Bản ShopLite riêng cho demo, đã có cấu hình Module 1 (context, quyền, hook)
git clone <repo-shoplite> shoplite-demo && cd shoplite-demo
npm install && npx playwright install chromium

# 2. Nhánh demo: tiêu chí + fixture + seed + config (KHÔNG có test GH-2..DH-3 - để generator sinh trên lớp)
git checkout -b demo-m6
cp <lab-guides>/module-6-playwright-ai/reference/playwright.config.ts .
mkdir -p specs e2e/gio-hang
cp <lab-guides>/module-6-playwright-ai/reference/tieu-chi.md specs/tieu-chi.md
cp <lab-guides>/module-6-playwright-ai/reference/e2e/fixtures.ts e2e/
cp <lab-guides>/module-6-playwright-ai/reference/e2e/gio-hang/them-san-pham.spec.ts e2e/gio-hang/
git add -A && git commit -m "demo: criteria, fixtures, config"

# 3. Quyền cho agent (file cá nhân)
#    gộp reference/settings.local.example.json vào .claude/settings.local.json

# 4. Bản thứ hai cho cảnh so sánh (cảnh 5), làm sẵn: đủ bộ test đáp án + 2 lỗi
git worktree add ../shoplite-loi -b demo-m6-loi demo-m6
cd ../shoplite-loi
npm install                                  # worktree là thư mục mới, chưa có node_modules
cp ../shoplite-demo/.claude/settings.local.json .claude/   # quyền cá nhân không đi theo git
cp -r <lab-guides>/module-6-playwright-ai/reference/e2e/* e2e/
mkdir -p e2e/tu-code && cp <lab-guides>/module-6-playwright-ai/reference/demo/sinh-tu-code.spec.ts e2e/tu-code/
git apply <lab-guides>/module-6-playwright-ai/reference/bugs/bug-1-mien-phi-giao-hang.diff
git apply <lab-guides>/module-6-playwright-ai/reference/bugs/bug-2-huy-don.diff
git add -A && git commit -m "refactor: gọn code giỏ hàng và hủy đơn"
cd ../shoplite-demo
```

> ⚠️ Next.js 16 không cho hai `next dev` chạy cùng thư mục, nhưng **hai thư mục khác nhau** thì được - chỉ
> cần khác cổng. Cảnh 5 chạy bản lỗi ở cổng 3001: `PORT=3001 npx playwright test` (config đọc `PORT`,
> `npm run dev` của Next cũng đọc `PORT`).

Mở sẵn: terminal 1 `npm run dev` (shoplite-demo), Claude Code ở terminal 2, trình duyệt ở
`http://localhost:3000`. Gõ `/mcp` kiểm `playwright-test: connected` trước khi lên lớp.

## Dòng thời gian

| Phút      | Việc                                                                                | Điều lớp cần thấy                                                         | Loại     |
| --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| 0 - 1,5   | `npx playwright init-agents --loop=claude`                                          | 3 file `.claude/agents/playwright-test-*.md`, `.mcp.json`, `specs/README.md` | Chạy thật |
| 1,5 - 5   | Planner cho luồng giỏ hàng, kèm `specs/tieu-chi.md`                                 | Trình duyệt **tự bấm** khắp ShopLite, rồi lưu `specs/gio-hang.plan.md`     | Chạy thật |
| 5 - 8,5   | Generator cho kịch bản GH-4, chạy test                                              | `// spec:`, `getByRole`, `{ tag: "@GH-4" }`. Test xanh                     | Chạy thật |
| 8,5 - 12  | Áp `doi-nhan-nut-thanh-toan.diff`, test đỏ, healer, đọc diff                        | Healer chỉ đổi **tên nút** trong locator                                   | Chạy thật |
| 12 - 15   | Hai bộ test trên cùng một app có 2 lỗi                                              | Bộ từ tiêu chí đỏ đúng 2; bộ sinh từ code xanh                              | Làm sẵn  |
| 15 - 20   | (dư giờ) Cho agent đọc trace của test DH-3 bằng dòng lệnh                           | "PATCH trả 200, tiêu đề vẫn _Chờ xác nhận_ → app sai"                      | Chạy thật |

## Cảnh 1 - Cài agent (1,5')

```bash
npx playwright init-agents --loop=claude
git status --short
```

Nói: _"Playwright không bán mô hình AI. Nó góp hướng dẫn (3 file Markdown) và công cụ (MCP server). Mô hình
là của Claude Code."_ Mở `.claude/agents/playwright-test-healer.md`, đọc to dòng:
_"Do not ask user questions, you are not interactive tool, do the most reasonable thing possible to pass the test."_
→ _"Nhớ câu này, cảnh 4 và bài 6.5 sẽ quay lại."_

Seed: `init-agents` vừa tạo `e2e/seed.spec.ts` rỗng. Thay bằng bản đáp án:
`cp <lab-guides>/module-6-playwright-ai/reference/e2e/seed.spec.ts e2e/`.

## Cảnh 2 - Planner (3,5')

Thoát và mở lại `claude` (để nạp `.mcp.json` và agent mới).

```text
Dùng agent playwright-test-planner. Seed: e2e/seed.spec.ts. Lưu kế hoạch vào specs/gio-hang.plan.md.
Lập kế hoạch cho luồng "Giỏ hàng và phí giao hàng" trong specs/tieu-chi.md (GH-1 tới GH-4).
Kỳ vọng lấy từ tiêu chí, không lấy từ màn hình. Tên kịch bản bắt đầu bằng mã tiêu chí.
Mỗi kịch bản một file trong e2e/gio-hang/. Không quá 6 kịch bản.
```

Trong lúc chờ: chỉ cho lớp cửa sổ Chromium đang tự mở trang, tự bấm. Mở file kế hoạch, cuộn tới GH-4:
_"Kế hoạch có ghi 'đúng 500.000 ₫ thì Miễn phí' không? Ai kiểm câu này? - Chúng ta, ở Bảng A."_

## Cảnh 3 - Generator (3,5')

```text
Dùng agent playwright-test-generator sinh test cho kịch bản GH-4 trong specs/gio-hang.plan.md.
Import test, expect từ "../fixtures" (dùng fixture shop). Gắn { tag: "@GH-4" }.
```

```bash
npx prettier --write e2e && npx playwright test --grep @GH-4 --reporter=line
```

Chỉ ba thứ trong file sinh ra: dòng `// spec:` (truy ngược về kế hoạch), `getByRole`/`getByTestId` (không
CSS), tag `@GH-4` (truy ngược về tiêu chí).

## Cảnh 4 - Healer (3,5')

```bash
git add -A && git commit -qm "demo: GH-4 generated"
git apply <lab-guides>/module-6-playwright-ai/reference/bugs/doi-nhan-nut-thanh-toan.diff
git commit -qam "feat(cart): đổi nhãn nút thanh toán theo yêu cầu UX"
npx playwright test --grep @GH-4 --reporter=line          # đỏ: không tìm thấy "Tiến hành thanh toán"
```

```text
Dùng agent playwright-test-healer: chạy test có tag @GH-4 và sửa nếu đỏ. Liệt kê ngắn gọn đã sửa gì.
```

```bash
git diff
```

Kết quả khi soạn bài: [demo/healer-doi-nhan.ket-qua.diff](demo/healer-doi-nhan.ket-qua.diff) - đúng một dòng
locator mỗi file (và dòng comment ngay trên nó). Hỏi lớp: _"Chấp nhận bản vá này không? Vì sao?"_ → Có: giao
diện đổi **có chủ ý**, có commit; healer không đụng `expect`.

Dọn: `git reset --hard HEAD~1` (bỏ commit đổi nhãn - hook Module 1 sẽ chặn lệnh này nếu **agent** chạy; giảng
viên chạy trong terminal của mình).

## Cảnh 5 - Cùng một lỗi, hai bộ test (3', làm sẵn)

```bash
cd ../shoplite-loi
npm run check 2>&1 | grep "Tests "                       # 83 passed - unit test không bắt được 2 lỗi
PORT=3001 npx playwright test --grep "@GH|@DH" --reporter=line     # bộ từ tiêu chí
PORT=3001 npx playwright test e2e/tu-code --reporter=line          # bộ sinh từ code
```

Kết quả khi soạn bài (Playwright 1.64.1):

| Bộ test                         | App có 2 lỗi                                                                  | Gỡ lỗi (`git revert HEAD`)                       |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| **Sinh từ tiêu chí** (11 test)  | **Đỏ đúng 2**: GH-4 và DH-3 (hủy đơn). 9 test còn lại xanh - và đó là đúng     | 11 xanh                                          |
| **Sinh từ code** (3 test)       | Xanh 2, test _"hủy đơn rồi tải lại"_ **chập chờn** (đỏ khoảng 1/2 số lần)      | **Đỏ 1**: test _"500.000đ vẫn cộng phí 30.000đ"_ - bộ test **bảo vệ lỗi** |

Nói: _"Bộ sinh từ code không sai cú pháp, không dùng CSS, chạy rất 'đẹp'. Nó chỉ trả lời câu hỏi khác: code có
còn làm như hôm qua không. Và nó có một test chập chờn vì chờ sai tín hiệu: nút 'Xác nhận hủy' đổi chữ thành
'Đang hủy…' ngay khi bấm, test tưởng xong rồi tải lại trang trước khi server kịp hủy."_

## Cảnh 6 (dư giờ) - Agent đọc trace

Trong `shoplite-loi`, sau khi chạy bộ tiêu chí ở cảnh 5:

```text
Đọc trace của test DH-3 "hủy đơn chờ xác nhận" trong test-results/ bằng npx playwright trace (open, actions,
action, requests, snapshot). Chỉ phân tích, không sửa gì. Trả lời: action nào hỏng, trang hiển thị gì,
PATCH /api/orders trả mã nào, và theo specs/tieu-chi.md thì lỗi của test hay của app.
```

Câu trả lời mong đợi: bước `Expect "toContainText"` trên heading hỏng sau 10 giây; snapshot sau bước đó vẫn là
_"Đơn hàng SL-... Chờ xác nhận"_; `PATCH` trả **200**; DH-3 yêu cầu đổi trạng thái **không cần tải lại** →
**app sai** (giao diện không làm mới sau khi hủy).

## Nếu có sự cố

| Sự cố                                          | Xử lý nhanh                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/mcp` không thấy `playwright-test`            | Chưa nạp lại: thoát `claude`, mở lại; kiểm `.mcp.json`; chạy thử `npx playwright run-test-mcp-server` |
| Planner chạy quá 4 phút                         | Dừng (`Esc`), mở [specs/mua-hang.plan.md](specs/mua-hang.plan.md) làm sẵn và nói tiếp              |
| Generator ghi file ra ngoài `e2e/`              | Lỗi _"Test file did not match any of the test dirs"_ - đúng bài học: `File:` trong kế hoạch phải ở `e2e/` |
| Mạng chậm, agent treo                          | Dùng file đáp án trong `reference/e2e/` và log healer trong `reference/demo/`                       |
