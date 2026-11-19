# Backlog tính năng cho các module tiếp theo

ShopLite được thiết kế để mở rộng: kiến trúc feature-based, repository pattern cho dữ liệu đơn hàng,
logic nghiệp vụ là hàm thuần có test, và có sẵn các "khoảng trống" thật (chưa có đăng nhập, chưa trừ tồn
kho, lưu file JSON...). Dưới đây là các tính năng gợi ý, nhóm theo giai đoạn SDLC / chủ đề module.

Độ khó: ⭐ (1-2 giờ) · ⭐⭐ (nửa ngày) · ⭐⭐⭐ (1 ngày+)

> Module 4-5 (BMAD) dùng 3 ý tưởng lớn hơn, nhiều epic, ghép từ các mục dưới đây (quản lý trạng thái đơn +
> trừ tồn kho + đăng nhập; quyền riêng tư đơn hàng; khuyến mãi theo thời gian):
> [module-4-bmad-planning/reference/feature-ideas.md](module-4-bmad-planning/reference/feature-ideas.md).

## 1. Tính năng thay thế cho Module 2 & 3 (chia nhóm để tránh trùng)

| Tính năng                        | Mô tả                                                                             | Chạm tới                         | Độ khó |
| -------------------------------- | --------------------------------------------------------------------------------- | -------------------------------- | ------ |
| Mã giảm giá _(Module 2)_         | Nhập mã ở thanh toán, % hoặc số tiền cố định, điều kiện tối thiểu, hết hạn        | checkout, orders, data           | ⭐⭐   |
| Danh sách yêu thích _(Module 3)_ | Nút ♡, badge header, trang /wishlist, localStorage                                | catalog, layout, feature mới     | ⭐⭐   |
| Đánh giá sản phẩm                | Khách gửi đánh giá 1-5 sao + bình luận; điểm trung bình cập nhật; lọc theo số sao | catalog, API mới, repository mới | ⭐⭐   |
| So sánh sản phẩm                 | Chọn tối đa 3 sản phẩm cùng danh mục, bảng so sánh thông số cạnh nhau             | catalog, trang mới               | ⭐⭐   |
| Sản phẩm đã xem gần đây          | Lưu 8 sản phẩm xem gần nhất, hiển thị ở trang chủ và trang chi tiết               | catalog, localStorage            | ⭐     |
| Phí ship theo tỉnh/thành         | Chọn tỉnh ở checkout; nội thành / ngoại thành / miền khác phí khác nhau           | checkout/pricing, orders         | ⭐⭐   |
| Mua lại đơn cũ                   | Nút "Mua lại" ở đơn đã giao/đã hủy: thêm lại toàn bộ sản phẩm còn hàng vào giỏ    | orders, cart                     | ⭐     |
| Gợi ý tìm kiếm (autocomplete)    | ✅ Thành PR mẫu của [Module 7](module-7-cicd-ai/7.2-checklist-va-review-bmad.md) (story 7.1, có lỗi cài sẵn)  | catalog, API mới                 | ⭐⭐   |

## 2. Theo chủ đề module AI trong SDLC

### Requirements & Product (AI hỗ trợ phân tích yêu cầu)

| Tính năng                           | Ghi chú cho bài lab                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Trang quản trị (admin) sản phẩm     | CRUD sản phẩm, upload ảnh - bài tập viết user story, acceptance criteria, phân rã epic                                               |
| Quản lý trạng thái đơn hàng (admin) | `ORDER_STATUSES` đã có `confirmed/shipping/delivered` nhưng chưa có luồng chuyển trạng thái → bài tập máy trạng thái + spec MODIFIED |
| Chương trình tích điểm              | Quy tắc nghiệp vụ phức tạp (tích/đổi điểm, hết hạn) - tốt cho luyện `/speckit-clarify`                                               |

### Design & Architecture (AI hỗ trợ thiết kế)

| Tính năng                                                     | Ghi chú                                                                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Chuyển lưu trữ JSON → SQLite/PostgreSQL (Prisma hoặc Drizzle) | `OrderRepository` là interface - chỉ cần viết implementation mới; bài tập ADR + migration |
| Đăng nhập & đơn hàng theo tài khoản                           | Hiện `/orders` hiển thị đơn của mọi người → bài tập auth (Auth.js/Clerk), phân quyền      |
| Trừ tồn kho khi đặt hàng, hoàn kho khi hủy                    | Tồn kho đang tĩnh - cần chuyển sản phẩm sang nơi lưu ghi được, xử lý đồng thời            |
| Chuyển API Route → Server Actions                             | So sánh hai kiến trúc, giữ nguyên test hành vi                                            |

### Implementation (AI coding nâng cao)

| Tính năng                                   | Ghi chú                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Dark mode                                   | Thêm theme toggle, CSS variables trong `globals.css` - nhỏ, thấy ngay thay đổi     |
| Đa ngôn ngữ Việt/Anh (i18n)                 | Text đang viết trực tiếp trong component → bài tập refactor diện rộng có kiểm soát |
| Thư viện ảnh sản phẩm                       | Thay emoji bằng nhiều ảnh thật + `next/image`, zoom, carousel                      |
| Menu mobile (hamburger)                     | Header hiện chỉ co gọn trên mobile - bài UI responsive                             |
| Thanh toán online (mock VNPay/MoMo sandbox) | Luồng redirect + callback + trạng thái thanh toán                                  |
| Email xác nhận đơn hàng                     | Tích hợp dịch vụ gửi mail (Resend...) + template                                   |

### Testing (AI sinh và cải thiện test)

> Đã thành [Module 6](module-6-playwright-ai/6.1-chon-luong-va-tieu-chi.md): E2E cho hủy đơn và hàng hết,
> agent Playwright (MCP) tự mở trình duyệt, lỗi cài sẵn `>=` → `>` ở ngưỡng miễn phí ship (bài 6.5).

| Việc                                         | Ghi chú                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| Tăng coverage lên ≥ 90%                      | `npm run test:coverage`; các trang `app/**/page.tsx` và `order-detail` chưa có test |
| E2E cho luồng hủy đơn và trạng thái hết hàng | ✅ Module 6 (tiêu chí GH-1, DH-3)                                                   |
| Contract test cho API                        | Sinh OpenAPI từ Zod schema, kiểm tra response khớp schema                           |
| Visual regression                            | Playwright `toHaveScreenshot()` so sánh trang chủ/sản phẩm - mở rộng của bài 6.6    |
| Test bằng Playwright MCP                     | ✅ Module 6 (planner, generator, healer qua MCP server `playwright-test`)           |
| Sửa repository ghi file đồng thời            | Bài 6.3 làm lộ lỗi bằng `--workers=4`; sửa xong thì bỏ `workers: 1` trong config    |

### Code Review & Refactoring

| Việc                             | Ghi chú                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Tách `CheckoutForm` (~330 dòng)  | Component lớn nhất dự án - bài tập refactor có test bảo vệ                                                                                 |
| Review PR của Module 2/3 bằng AI | Dùng chính nhánh `lab2-speckit`, `lab3-openspec` làm PR để review - quy trình của Module 7 (7.2-7.3) áp dụng nguyên                        |
| Debug lỗi cài sẵn                | Giảng viên tạo nhánh có bug (ví dụ đổi `>=` thành `>` ở ngưỡng miễn phí ship, bỏ `await` trong repository) để sinh viên dùng AI tìm và sửa |

### Security (AI hỗ trợ bảo mật)

| Việc                                 | Ghi chú                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Rate limiting cho `POST /api/orders` | Hiện chưa có giới hạn → chống spam đơn                                    |
| Rà soát OWASP cho API                | Validate đã có (Zod); kiểm tra thêm kích thước body, header bảo mật, CSRF |
| Quét secret & dependency             | ✅ Module 7: gitleaks (cả lịch sử commit) + `npm audit` trong gate `bao-mat` |
| Chống ReDoS / regex injection        | ✅ Module 7: luật lint BM-1 cấm `new RegExp(<biến>)` trong `src/`          |

### Performance

| Việc                                     | Ghi chú                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Giảm bundle phía client                  | Client component đang import `catalog-service` (kéo theo toàn bộ dữ liệu sản phẩm) → tách phần dùng ở client |
| Cache dữ liệu catalog                    | Thử `use cache` / Cache Components của Next.js 16                                                            |
| Phân trang / infinite scroll phía server | Khi dữ liệu lớn hơn (seed 1.000 sản phẩm)                                                                    |

### DevOps / CI-CD

> Đã thành [Module 7](module-7-cicd-ai/7.1-dua-len-github-4-gate.md): 4 gate trên GitHub Actions, AI review mỗi PR
> bằng `claude-code-action` + `bmad-code-review`, AI giải thích CI đỏ, ruleset khoá `main`.

| Việc                       | Ghi chú                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| GitHub Actions             | ✅ Module 7 (bài 7.1): lint, unit, e2e, bao-mat chạy cùng `scripts/ci/gate.mjs` ở máy và CI |
| AI review tự động trong CI | ✅ Module 7 (bài 7.3, 7.4)                                                                 |
| Coverage cho riêng code mới | Sàn toàn cục không nói tính năng mới có test (bài 7.2) → đo coverage của file trong diff  |
| Merge queue                | Khi nhiều PR cùng lúc: `strict_required_status_checks_policy` hoặc merge queue của GitHub  |
| Dockerfile + deploy        | Deploy lên Vercel/Render; lưu ý file JSON không bền vững trên serverless → liên hệ bài DB |

### Documentation

| Việc                                | Ghi chú                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Sinh tài liệu API (OpenAPI/Swagger) | Từ Zod schema + route handlers                                                |
| Storybook cho UI components         | `components/ui` và các card                                                   |
| Architecture Decision Records       | Ghi lại các quyết định đã có (feature-based, JSON storage, localStorage cart) |

### Agent và tự động hoá

> Đã thành [Module 8](module-8-agent-workflow/8.1-chon-viec-va-ban-thiet-ke.md): bản thiết kế 11 mục, skill hoặc subagent, MCP, hook nhật ký, năm ca
> thử máy chấm, workflow hai job ra Release nháp.

| Việc                                | Ghi chú                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| Viết release note từ PR             | ✅ Module 8, agent mẫu `release-notes`                                           |
| Soát đơn Chờ xác nhận mỗi sáng      | ✅ Module 8, agent mẫu `don-sang` (MCP `shoplite-don`); hiện chỉ đề xuất vào hàng chờ |
| Soát PR trước khi mở                | Ý tưởng của lab: subagent đọc diff theo `.github/review-checklist.md`            |
| Tóm tắt CI mỗi sáng                 | Ý tưởng của lab: `gh run list`, `gh run view`, che bằng `che-secret.mjs`         |
| Nhân viên duyệt hàng chờ đề xuất    | Màn hình duyệt `storage/de-xuat-don.json`, nối với luồng chuyển trạng thái đơn   |

### Tính năng AI trong sản phẩm

| Tính năng               | Ghi chú                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| Chatbot tư vấn sản phẩm | Trả lời dựa trên dữ liệu catalog (tool calling gọi `queryProducts`) |
| Tìm kiếm ngữ nghĩa      | "tai nghe để chạy bộ" → embedding + vector search                   |
| Sinh mô tả sản phẩm     | Trong trang admin, sinh mô tả từ thông số kỹ thuật                  |
| Tóm tắt đánh giá        | Sau khi có tính năng đánh giá: tóm tắt ưu/nhược điểm từ review      |

## 3. Nợ kỹ thuật có sẵn (cố ý giữ lại để làm bài)

| Hiện trạng                                                     | File                                                 | Dùng cho module             |
| -------------------------------------------------------------- | ---------------------------------------------------- | --------------------------- |
| Không trừ tồn kho sau khi đặt hàng                             | `src/features/orders/order-service.ts`               | Architecture, Concurrency   |
| Không có đăng nhập, `/orders` hiển thị mọi đơn                 | `src/app/orders/page.tsx`                            | Security, Auth              |
| Đơn hàng lưu file JSON, không an toàn khi ghi đồng thời        | `src/features/orders/order-repository.ts`            | Database migration          |
| Client bundle chứa toàn bộ dữ liệu sản phẩm                    | `src/features/catalog/catalog-service.ts`            | Performance                 |
| `CheckoutForm` dài, state form tự quản lý                      | `src/features/checkout/components/checkout-form.tsx` | Refactoring                 |
| Text tiếng Việt viết cứng trong component                      | toàn bộ `src/`                                       | i18n                        |
| Trạng thái `confirmed/shipping/delivered` chưa có luồng chuyển | `src/features/orders/types.ts`                       | Requirements, State machine |
