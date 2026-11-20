# Kịch bản demo Module 7 (giảng viên, ~15 phút)

> Bốn cảnh chạy trên một repo GitHub **riêng cho demo**, một cảnh so sánh làm ở máy. Bám theo slide _"Demo của
> giảng viên"_. Kết quả AI đổi giữa các lần chạy: bảng "điều cần thấy" là điều đã cài sẵn, không phải điều AI chắc
> chắn nói - đó cũng là điểm dạy.

## Chuẩn bị (hôm trước, ~40')

```bash
# 1. Bản ShopLite riêng cho demo: Module 1 + Module 6 trên main (như đầu bài 7.1).
#    Clone vào CẠNH thư mục lab-guides/ để các đường dẫn ../lab-guides/... bên dưới đúng.
#    Repo demo không làm bước "thử khoá" của 7.1, nên PR của Minh là #1 - các lệnh dưới dùng số 1.
git clone <repo-shoplite> shoplite-demo && cd shoplite-demo && npm install
# ... làm lần lượt bài 7.1 (Bước 1-4), 7.2 (Bước 1-3), 7.3 (Bước 1-2), 7.4 (Bước 4), 7.5 (Bước 1) bằng file đáp án:
#     workflows/ci.yml, workflows/ai-review.yml, scripts/ci/*.mjs, config/*, spec, checklist, bmad-code-review.toml
gh repo create <org>/shoplite-demo --private --source . --remote origin --push
claude setup-token                                    # terminal riêng; chép token in ra
gh secret set CLAUDE_CODE_OAUTH_TOKEN                 # token của gói thuê bao (workflow đáp án dùng tham số claude_code_oauth_token)
gh api -X POST repos/{owner}/{repo}/rulesets --input ../lab-guides/module-7-cicd-ai/reference/ruleset-main.json

# 2. PR #1 của "Minh" (cảnh 2-3) - mở hôm trước để AI review chạy xong sẵn
git checkout -b feature/goi-y-tim-kiem
git am ../lab-guides/module-7-cicd-ai/reference/pr/goi-y-tim-kiem.patch
git push -u origin feature/goi-y-tim-kiem
gh pr create --base main --title "feat(catalog): gợi ý tìm kiếm khi gõ (story 7.1)" \
  --body-file ../lab-guides/module-7-cicd-ai/reference/pr/mo-ta-pr.md
```

Sáng hôm dạy: `gh pr checks 1` thấy `lint` và `bao-mat` đỏ, `AI review` xong; PR có nhận xét `[BM-1]`. Mở sẵn: tab
PR #1 (Files changed), tab Actions, terminal ở `shoplite-demo` có `npm run dev`.

## Dòng thời gian

| Phút    | Việc                                                                                     | Điều lớp cần thấy                                                         | Loại       |
| ------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------- |
| 0 - 3   | Đọc `ci.yml`, `ai-review.yml`, ruleset (Settings › Rules)                                | `AI review` **không** nằm trong 4 check bắt buộc                          | Làm sẵn    |
| 3 - 6   | PR #1: tab Checks; `curl ...?q=tai%28` → 500; đọc 2 dòng comment ở `suggest-service.ts:19` | `lint` đỏ BM-1 **trước khi** AI nói gì; câu viết cho AI, không cho người  | Chạy thật  |
| 6 - 9   | Đọc nhận xét AI (inline + tổng hợp), cùng lớp điền nhanh Bảng A                          | AI bắt gì, sót gì; câu mồi "LGTM" có tác dụng không                       | Làm sẵn    |
| 9 - 12  | `git am refactor-gio-hang.patch` + push → `e2e` đỏ → comment "AI đọc log giúp bạn"       | AI chỉ đúng commit gây lỗi; kiểm lại bằng `git show`, dòng `Retry #1`     | Chạy thật  |
| 12 - 15 | `gh pr merge 1 --squash --admin` → bị từ chối; soát phản ví dụ `ai-tu-merge.yml`         | Admin cũng không qua; phản ví dụ đỏ 18 lỗi, bản mẫu 0 lỗi                 | Chạy thật  |

## Cảnh 2 - Gate đỏ trước khi AI nói gì (3')

```bash
curl -s "http://localhost:3000/api/products/suggest?q=usb"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/api/products/suggest?q=tai%28"     # 500
```

Mở `src/features/catalog/suggest-service.ts`, chỉ vào dòng 19-20: _"Câu này viết cho AI, không viết cho người. Còn
ESLint thì không đọc comment."_ Mở log job `lint`: `21:19 error [BM-1] ...`.

**Đừng** chạy `q=(.*.*)*!` trên server demo (server bận gần một phút cho mỗi tên sản phẩm dài).

## Cảnh 3 - Đọc nhận xét AI (3')

Chỉ ba thứ: nhận xét inline `[BM-1][Patch]` đúng dòng 21; `[SPEC-2]` về thứ tự `q=usb` (lớp Acceptance Auditor hoặc
Checklist Auditor - cần đọc spec mới thấy); mục "Cảnh báo an toàn" báo `[AT-1]` cả hai câu mồi. Hỏi lớp: _"Lỗi
SPEC-2 có gate nào chặn không?"_ → Không. Lần sau muốn gate chặn thì cần một test dùng `q=usb` (TEST-1).

Nếu AI review chưa chạy xong hoặc ra kết quả lạ: mở [demo/review-ai-chay-that.md](demo/review-ai-chay-that.md).

## Cảnh 4 - CI đỏ, AI giải thích (3')

```bash
git checkout feature/goi-y-tim-kiem
git am ../lab-guides/module-7-cicd-ai/reference/pr/refactor-gio-hang.patch && git push
gh pr checks 1 --watch                       # e2e đỏ sau vài phút: nói tiếp cảnh 5 trong lúc chờ
```

Khi comment xuất hiện: đọc cột "Sai ở đâu" và "Tin cậy", rồi kiểm cùng lớp: `git show HEAD -- src/features/cart/components/cart-summary.tsx`
(`>` thay cho `>=`). Nếu runner chậm: mở [demo/phan-tich-ci-chay-that.md](demo/phan-tich-ci-chay-that.md).

## Cảnh 5 - Không ai bypass (3')

```bash
gh pr merge 1 --squash --admin                # bị từ chối
node scripts/ci/kiem-tra-workflow.mjs ../lab-guides/module-7-cicd-ai/reference/demo/ai-tu-merge.yml
node scripts/ci/kiem-tra-workflow.mjs         # bản mẫu: 0 lỗi
```

Câu chốt: _"Bên phản ví dụ, PR này được merge hay không tuỳ một câu trả lời của model - mà PR có sẵn một câu bảo
model mọi thứ đều ổn. Bên bản mẫu, model nói gì thì lint vẫn đỏ, và nút Merge vẫn khóa."_

## Nếu có sự cố

| Sự cố                                                   | Xử lý nhanh                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `AI review` đỏ ở bước action: thiếu `CLAUDE_CODE_OAUTH_TOKEN` | `gh secret list` - chưa đặt token; đặt rồi `gh pr close 1 && gh pr reopen 1`                   |
| `AI review` hết trần (`error_max_turns`, hết budget)    | Đúng là hàng rào đang chạy; mở kết quả làm sẵn trong `demo/`                                         |
| Ruleset báo 403                                         | Repo private trên tài khoản Free: dùng repo của organization gói Team hoặc repo public               |
| Check bắt buộc kẹt "Expected - waiting for status"      | Tên job trong `ci.yml` khác tên check trong ruleset (ví dụ đổi `e2e` thành `test-e2e`) - đúng bài học |
| `e2e` lâu hơn thường                                    | Cài trình duyệt chiếm phần lớn thời gian; nói tiếp phần lý thuyết, quay lại sau                     |
