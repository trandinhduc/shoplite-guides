# Lab AI trong SDLC: AI Coding Agent, Spec Kit, OpenSpec, BMAD Method, Playwright, CI/CD có AI, Agent tự động

Bộ hướng dẫn thực hành trên dự án mẫu **ShopLite** (cửa hàng đồ công nghệ mini, Next.js 16).
Mỗi file tương ứng một bài, có lệnh để chạy, prompt mẫu để dán cho agent, kết quả mong đợi và
checkpoint để tự kiểm tra.

## Mục tiêu sau buổi học

- Cấu hình được một AI coding agent cho dự án thật: context file, quyền hạn, hook tự động.
- Phát triển một tính năng theo quy trình **Spec-Driven Development** với GitHub Spec Kit.
- Đề xuất, khám phá code, triển khai và kiểm chứng một tính năng khác với OpenSpec.
- So sánh được hai cách làm "spec-first" và biết khi nào dùng cách nào.
- Dùng **BMAD Method** đi từ một ý tưởng thô tới backlog: brainstorm, phản biện bằng nhiều agent, brief,
  PRD, UX, kiến trúc, epic/story, sprint.
- Cho AI implement từng story, rồi cho **AI khác review** theo 4 góc nhìn, chấm finding và sửa lỗi có test.
- Dựng bộ test E2E bằng **Playwright** cho code có sẵn: viết tiêu chí trước, cho 3 agent (planner, generator,
  healer) sinh và sửa test, tự duyệt kế hoạch và bản vá, phân biệt _test sai_ với _app sai_, rồi viết test
  custom bảo vệ tính năng đã làm ở Module 2, 3 hoặc 5.
- Dựng **CI trên GitHub Actions** với 4 gate tất định (lint, unit, E2E, quét bảo mật bằng gitleaks), cho **AI review
  mỗi PR** theo skill `bmad-code-review` và checklist của nhóm, cho AI **giải thích CI đỏ**, dựng hàng rào để khoá
  không lọt, câu mồi không điều khiển được AI, mỗi lần review có trần; và để **gate + người duyệt** quyết định merge.
- Giao trọn **một việc lặp lại** cho agent: viết bản thiết kế một trang, dựng bằng skill hoặc subagent, nối dữ liệu qua
  script hoặc MCP, giới hạn quyền theo danh sách đóng, đo bằng **năm ca thử** máy chấm; chạy theo lệnh hoặc theo lịch,
  và người duyệt trước khi kết quả có hiệu lực.

## Lộ trình (~6.5 giờ, chưa tính giải lao)

| Bài          | Nội dung                                                | Thời lượng | File                                                                                         |
| ------------ | ------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| 0            | Chuẩn bị môi trường, chạy thử ShopLite                  | 20'        | [00-chuan-bi-moi-truong.md](00-chuan-bi-moi-truong.md)                                       |
| **Module 1** | **Làm quen với AI Coding Agent**                        |            |                                                                                              |
| 1.1          | Tạo context file: `CLAUDE.md`, `AGENTS.md`, rules       | 35'        | [module-1-ai-coding-agent/1.1-context-file.md](module-1-ai-coding-agent/1.1-context-file.md) |
| 1.2          | Cấu hình permission cho agent                           | 30'        | [module-1-ai-coding-agent/1.2-permissions.md](module-1-ai-coding-agent/1.2-permissions.md)   |
| 1.3          | Viết custom hook và kiểm thử                            | 45'        | [module-1-ai-coding-agent/1.3-custom-hooks.md](module-1-ai-coding-agent/1.3-custom-hooks.md) |
| **Module 2** | **Spec Kit** - tính năng _Mã giảm giá_                  |            |                                                                                              |
| 2.1          | Khởi tạo Spec Kit + constitution (luật dự án)           | 25'        | [module-2-speckit/2.1-init-constitution.md](module-2-speckit/2.1-init-constitution.md)       |
| 2.2          | Định nghĩa tính năng & viết spec (`specify`, `clarify`) | 30'        | [module-2-speckit/2.2-specify.md](module-2-speckit/2.2-specify.md)                           |
| 2.3          | Lập kế hoạch kỹ thuật (`plan`)                          | 25'        | [module-2-speckit/2.3-plan.md](module-2-speckit/2.3-plan.md)                                 |
| 2.4          | Chia task (`tasks`, `analyze`)                          | 15'        | [module-2-speckit/2.4-tasks.md](module-2-speckit/2.4-tasks.md)                               |
| 2.5          | Implement & test (`implement`, `converge`)              | 45'        | [module-2-speckit/2.5-implement-test.md](module-2-speckit/2.5-implement-test.md)             |
| **Module 3** | **OpenSpec** - tính năng _Danh sách yêu thích_          |            |                                                                                              |
| 3.1          | Khởi tạo OpenSpec, dùng lại `CLAUDE.md` làm codemap     | 25'        | [module-3-openspec/3.1-init-codemap.md](module-3-openspec/3.1-init-codemap.md)               |
| 3.2          | Tạo proposal cho tính năng mới (`/opsx:propose`)        | 25'        | [module-3-openspec/3.2-proposal.md](module-3-openspec/3.2-proposal.md)                       |
| 3.3          | Khám phá luồng code (`/opsx:explore`)                   | 25'        | [module-3-openspec/3.3-explore.md](module-3-openspec/3.3-explore.md)                         |
| 3.4          | Apply, verify, archive                                  | 45'        | [module-3-openspec/3.4-apply-verify.md](module-3-openspec/3.4-apply-verify.md)               |
|              | Ý tưởng tính năng cho các module sau                    |            | [FEATURE-BACKLOG.md](FEATURE-BACKLOG.md)                                                     |

## Lộ trình Ngày 2 - BMAD Method (~6 giờ, chưa tính giải lao)

| Bài          | Nội dung                                                                        | Thời lượng | File                                                                                                   |
| ------------ | ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| **Module 4** | **BMAD - từ ý tưởng tới Backlog** (chọn 1 trong 3 ý tưởng)                      |            | [module-4-bmad-planning/reference/feature-ideas.md](module-4-bmad-planning/reference/feature-ideas.md) |
| 4.1          | Cài BMAD v6.12.4, tiếng Việt, `/bmad-help`                                      | 25'        | [module-4-bmad-planning/4.1-install.md](module-4-bmad-planning/4.1-install.md)                         |
| 4.2          | Brainstorm ý tưởng (`/bmad-brainstorming`)                                      | 35'        | [module-4-bmad-planning/4.2-brainstorm.md](module-4-bmad-planning/4.2-brainstorm.md)                   |
| 4.3          | Phản biện bằng góc nhìn agent (party mode, advanced elicitation)                | 25'        | [module-4-bmad-planning/4.3-validate-idea.md](module-4-bmad-planning/4.3-validate-idea.md)             |
| 4.4          | Product brief → PRD (`/bmad-product-brief`, `/bmad-prd`)                        | 40'        | [module-4-bmad-planning/4.4-brief-prd.md](module-4-bmad-planning/4.4-brief-prd.md)                     |
| 4.5          | UX & design system (`/bmad-ux`)                                                 | 25'        | [module-4-bmad-planning/4.5-ux-design.md](module-4-bmad-planning/4.5-ux-design.md)                     |
| 4.6          | Kiến trúc cho tính năng (`/bmad-architecture`)                                  | 30'        | [module-4-bmad-planning/4.6-architecture.md](module-4-bmad-planning/4.6-architecture.md)               |
| 4.7          | Epic, story, sprint (`/bmad-create-epics-and-stories`, `/bmad-sprint-planning`) | 35'        | [module-4-bmad-planning/4.7-epics-sprint.md](module-4-bmad-planning/4.7-epics-sprint.md)               |
| **Module 5** | **BMAD - từ story tới AI review code**                                          |            |                                                                                                        |
| 5.1          | Implement story (`/bmad-build`)                                                 | 60'        | [module-5-bmad-build-review/5.1-build.md](module-5-bmad-build-review/5.1-build.md)                     |
| 5.2          | Review 4 góc nhìn bằng model khác (`/bmad-code-review`)                         | 40'        | [module-5-bmad-build-review/5.2-code-review.md](module-5-bmad-build-review/5.2-code-review.md)         |
| 5.3          | Sửa lỗi sau review, đóng sprint, bug bash                                       | 45'        | [module-5-bmad-build-review/5.3-fix-findings.md](module-5-bmad-build-review/5.3-fix-findings.md)       |

## Lộ trình Ngày 3 - Test tự động với Playwright và AI (~3.5 giờ, chưa tính giải lao)

| Bài          | Nội dung                                                                                    | Thời lượng | File                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| **Module 6** | **Test tự động với Playwright và AI** - luồng giỏ hàng & đặt hàng, rồi tính năng của bạn    |            | Slide: _Module 6 – Test tự động với Playwright và AI_                                                                |
| 6.1          | Chọn luồng đáng test, viết bộ tiêu chí cho code có sẵn (AI nháp, người duyệt)               | 20'        | [module-6-playwright-ai/6.1-chon-luong-va-tieu-chi.md](module-6-playwright-ai/6.1-chon-luong-va-tieu-chi.md)         |
| 6.2          | Dựng bộ test từ con số không: config, `init-agents`, seed, fixture, test đầu tiên `codegen` | 35'        | [module-6-playwright-ai/6.2-dung-bo-test-tu-dau.md](module-6-playwright-ai/6.2-dung-bo-test-tu-dau.md)               |
| 6.3          | Thực hành lệnh Playwright: lọc, UI mode, debug, báo cáo, trace, chạy lặp, test chập chờn    | 30'        | [module-6-playwright-ai/6.3-lenh-playwright.md](module-6-playwright-ai/6.3-lenh-playwright.md)                       |
| 6.4          | Planner → Generator → Healer từ tiêu chí; duyệt kế hoạch (Bảng A) và bản vá (Bảng B)        | 50'        | [module-6-playwright-ai/6.4-planner-generator-healer.md](module-6-playwright-ai/6.4-planner-generator-healer.md)     |
| 6.5          | Đọc đúng màu đỏ: lỗi cài sẵn, trace, test sai hay app sai, test "sinh từ code" khóa lỗi     | 25'        | [module-6-playwright-ai/6.5-doc-dung-mau-do.md](module-6-playwright-ai/6.5-doc-dung-mau-do.md)                       |
| 6.6          | Custom test cho tính năng đã làm ở Module 2/3/5: custom fixture, API, giả lập mạng, đa tab  | 40'        | [module-6-playwright-ai/6.6-custom-test-tinh-nang-cu.md](module-6-playwright-ai/6.6-custom-test-tinh-nang-cu.md)     |
|              | Kịch bản demo cho giảng viên (~20')                                                         |            | [module-6-playwright-ai/reference/kich-ban-demo.md](module-6-playwright-ai/reference/kich-ban-demo.md)               |

Module 6 dùng lại mọi thứ trước đó: `.claude/rules/testing.md` và hook của Module 1 (format, quality-gate,
chặn `curl`), tính năng của Module 2/3/5 làm đối tượng cho bài 6.6, và nợ kỹ thuật "ghi file đồng thời" của
FEATURE-BACKLOG trở thành ví dụ test chập chờn do app ở bài 6.3.

## Lộ trình Ngày 4 - CI/CD có AI hỗ trợ (~3 giờ, chưa tính giải lao)

| Bài          | Nội dung                                                                                         | Thời lượng | File                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------ |
| **Module 7** | **CI/CD có AI hỗ trợ** - PR "Gợi ý tìm kiếm" (story 7.1) của một đồng nghiệp, có lỗi cài sẵn       |            | Slide: _Module 7 – CI/CD có AI hỗ trợ_                                                                 |
| 7.1          | Fork repo mẫu về tài khoản của bạn, token `claude setup-token`; `ci.yml` với 4 gate: lint, unit, e2e, bao-mat | 35'        | [module-7-cicd-ai/7.1-dua-len-github-4-gate.md](module-7-cicd-ai/7.1-dua-len-github-4-gate.md)         |
| 7.2          | Checklist của nhóm theo spec; lớp Checklist Auditor; review PR bằng `/bmad-code-review` ở máy      | 35'        | [module-7-cicd-ai/7.2-checklist-va-review-bmad.md](module-7-cicd-ai/7.2-checklist-va-review-bmad.md)   |
| 7.3          | Runner Docker cho job review; `ai-review.yml` với 4 tham số `claude_code_oauth_token`, `github_token`, `prompt`, `claude_args` | 45'        | [module-7-cicd-ai/7.3-ai-review-tu-dong.md](module-7-cicd-ai/7.3-ai-review-tu-dong.md)                 |
| 7.4          | AI giải thích CI đỏ: che secret, phân loại lỗi, việc tiếp theo; hai job tách khoá và quyền ghi     | 30'        | [module-7-cicd-ai/7.4-ai-giai-thich-ci-do.md](module-7-cicd-ai/7.4-ai-giai-thich-ci-do.md)             |
| 7.5          | Hàng rào: khoá không lọt, quét câu mồi, trần thời gian/lượt/tiền, 12 luật soát workflow, thử tấn công | 30'     | [module-7-cicd-ai/7.5-hang-rao-bao-mat.md](module-7-cicd-ai/7.5-hang-rao-bao-mat.md)                   |
| 7.6          | Ruleset khoá `main`, sửa PR theo nhận xét có test, người duyệt, merge; bài nộp                     | 30'        | [module-7-cicd-ai/7.6-khoa-merge-sua-pr.md](module-7-cicd-ai/7.6-khoa-merge-sua-pr.md)                 |
|              | Kịch bản demo cho giảng viên (~15')                                                              |            | [module-7-cicd-ai/reference/kich-ban-demo.md](module-7-cicd-ai/reference/kich-ban-demo.md)             |

Module 7 dùng lại: bộ E2E của Module 6 làm gate `e2e` (và lỗi cài sẵn GH-4 của bài 6.5 làm "commit refactor" làm đỏ
CI), `bmad-code-review` của Module 5 thêm lớp Checklist Auditor, settings và hook của Module 1 (và lý do **không**
nạp chúng trên CI), spec dạng `bmad-build` cho story 7.1. Học viên làm **theo cặp**: mỗi người một repo, người kia
duyệt PR.

## Lộ trình Ngày 4 (tiếp) - Agent và workflow tự động (~2 giờ, chưa tính giải lao)

Giảng 30', demo 15', lab 75'. Bảng dưới là phần lab.

| Bài          | Nội dung                                                                                      | Thời lượng | File |
| ------------ | --------------------------------------------------------------------------------------------- | ---------- | ---- |
| **Module 8** | **Agent và workflow tự động** - một việc lặp lại của ShopLite, mẫu: `release-notes`, `don-sang` |            | Slide: _Module 8 – Agent và workflow tự động_ |
| 8.1          | Chọn một việc; bản thiết kế 11 mục, bạn cùng cặp soát                                         | 17'        | [module-8-agent-workflow/8.1-chon-viec-va-ban-thiet-ke.md](module-8-agent-workflow/8.1-chon-viec-va-ban-thiet-ke.md) |
| 8.2          | Dựng skill hoặc subagent, nối script hoặc MCP, hook nhật ký, `soat-quyen.mjs` 0 lỗi           | 18'        | [module-8-agent-workflow/8.2-dung-agent-va-gioi-han-quyen.md](module-8-agent-workflow/8.2-dung-agent-va-gioi-han-quyen.md) |
| 8.3          | Năm ca thử máy chấm, vân tay agent, sửa tới khi qua 4/5                                       | 18'        | [module-8-agent-workflow/8.3-nam-ca-thu.md](module-8-agent-workflow/8.3-nam-ca-thu.md) |
| 8.4          | Workflow hai job ra Release nháp, hoặc chạy tay đọc nhật ký; mở PR qua 4 gate                 | 12'        | [module-8-agent-workflow/8.4-chay-tu-dong-va-nhat-ky.md](module-8-agent-workflow/8.4-chay-tu-dong-va-nhat-ky.md) |
| 8.5          | Chạy trước bạn cùng cặp trên đầu vào chưa thấy; đề capstone; bài nộp                          | 10'        | [module-8-agent-workflow/8.5-ban-cung-cap-va-capstone.md](module-8-agent-workflow/8.5-ban-cung-cap-va-capstone.md) |
|              | Kịch bản demo cho giảng viên (~15')                                                           |            | [module-8-agent-workflow/reference/kich-ban-demo.md](module-8-agent-workflow/reference/kich-ban-demo.md) |
| **8 (gọn)**  | Một bài, một agent `don-sang`: soát đơn Chờ xác nhận qua MCP, hàng chờ cho nhân viên duyệt, năm ca thử | 65'        | [module-8-new/8-agent-soat-don-sang.md](module-8-new/8-agent-soat-don-sang.md) |

Module 8 dùng lại: quyền và hook của Module 1 (và lý do phải chặn lại các luật đó khi chạy không cần người), `playwright-test` của
Module 6 làm ví dụ MCP, `kiem-tra-workflow.mjs`, `quet-cau-moi.mjs`, gate `bao-mat`, ruleset và cách tách hai job của Module 7. Học viên
vẫn làm **theo cặp**: bạn cùng cặp soát bản thiết kế, đưa đầu vào chưa thấy và duyệt PR.

## Chiến lược nhánh Git

```text
main ── baseline ── (Module 1: context + permissions + hooks) ──┬── lab2-speckit   (Module 2) ──────┐
                                                                ├── lab3-openspec  (Module 3) ──────┤
                                                                ├── lab4-bmad      (Module 4: chỉ tài liệu)
                                                                │      └── lab5-build   (Module 5) ─┤  bài 6.6: merge lab6-e2e
                                                                └── lab6-e2e       (Module 6: 6.1-6.5)  └─► lab6-coupon | lab6-wishlist | lab6-ops
```

Module 1 commit thẳng lên `main`. Module 2, 3 và 4 tách nhánh riêng từ `main` để các công cụ không
lẫn file của nhau và có thể so sánh kết quả bằng `git diff main..lab2-speckit`. Module 5 **kế thừa**
Module 4 (cần `epics.md`, `sprint-status.yaml`), nên tách từ `lab4-bmad`; `git diff lab4-bmad..lab5-build`
chỉ còn code.

Module 6 tách `lab6-e2e` từ `main` (bộ test cho code gốc). Ở bài 6.6, mỗi người chọn **một** nhánh tính năng
(`lab2-speckit`, `lab3-openspec` hoặc `lab5-build`), tách nhánh mới và `git merge lab6-e2e` để bộ test vừa
làm hồi quy cho tính năng, vừa có chỗ thêm test custom. Các nhánh thử (`lab6-heal`, `lab6-bug`,
`lab6-mutation`) dùng xong thì xóa, không merge.

Module 7 làm trên `main` của **fork của bạn** (fork từ <https://github.com/trandinhduc/shoplite>, bài 7.1), vì workflow và ruleset phải nằm ở nhánh mặc định: merge
`lab6-e2e` vào `main` (bài 7.1), đẩy thẳng các commit CI lên `main` cho tới bài 7.6, sau đó `main` bị khoá - chỉ
vào được qua PR có 4 check xanh và một người duyệt. PR của "đồng nghiệp" nằm ở `feature/goi-y-tim-kiem`; các nhánh
thử (`thu-khoa`, `thu-tan-cong`) dùng xong thì xóa ở cả máy và GitHub.

```text
main ── merge lab6-e2e ── 4 gate ── BMAD + spec 7.1 + checklist ── AI review ── AI giải thích CI đỏ ── hàng rào ── ruleset ──┬── squash PR #1
            (7.1)          (7.1)            (7.2)                    (7.3)            (7.4)            (7.5)      (7.6)    │
                                     └── feature/goi-y-tim-kiem: feat (Minh) ── refactor (Minh, 7.4) ── revert + fix (7.6) ┘
```

Module 8 tách `lab8-agent` từ `main` đã khoá, vào lại `main` qua PR có 4 check xanh và bạn cùng cặp duyệt. Workflow lịch chỉ chạy sau khi
PR merge. Hai tag `v0.1.0`, `v0.2.0` gắn trên `main` để agent mẫu `release-notes` có dữ liệu. Nhánh `thu-lam-au` của kịch bản demo không merge.

## Quy ước trong tài liệu

- `$ lệnh` - chạy trong terminal, tại thư mục `shoplite/`.
- `> prompt` hoặc khối có nhãn **Prompt** - dán vào ô chat của Claude Code.
- ✅ **Checkpoint** - điều kiện để chuyển sang bước tiếp theo.
- ⚠️ - lỗi hay gặp / lưu ý phiên bản.
- Thư mục `reference/` trong mỗi module là **đáp án tham khảo** - chỉ mở ra sau khi tự làm.

## Phiên bản công cụ đã kiểm chứng (10/2026)

| Công cụ              | Phiên bản | Ghi chú                                                                  |
| -------------------- | --------- | ------------------------------------------------------------------------ |
| Node.js              | 22.12+    | Node 20 đã hết hỗ trợ                                                    |
| Claude Code          | 2.1.x     | Lệnh `claude`                                                            |
| Spec Kit (`specify`) | 1.2.x     | Cú pháp mới: `--integration claude`, lệnh `/speckit-...` (gạch nối)      |
| OpenSpec             | 1.14.x    | Workflow OPSX: `/opsx:propose`, `/opsx:apply`...                         |
| BMAD Method          | 6.12.4    | `npx bmad-method@6.12.4 install`; cần **uv** (Python 3.11+ do uv tự tải) |
| Playwright           | 1.64.x    | Có sẵn trong `devDependencies`; `npx playwright init-agents --loop=claude` |
| claude-code-action   | v1.0.259  | Ghim theo SHA `ae68417a…` (Claude Code 2.1.309 bên trong); 4 tham số `claude_code_oauth_token` (token của `claude setup-token`; dùng khoá API thì `anthropic_api_key`), `github_token`, `prompt`, `claude_args` |
| Runner cho job AI review | actions-runner 2.338.2 | Image của lớp: `module-7-cicd-ai/reference/runner/Dockerfile` (Node 22.23.5, `gh`, Claude Code 2.1.309, Bun 1.3.14). Cần một phần mềm chạy container: Rancher Desktop, Docker Engine trong WSL2 hoặc colima (xem `CAI-DAT-MOI-TRUONG.md` mục 5.3); không có thì job chạy trên máy của GitHub |
| gitleaks             | 8.30.1    | CLI, tải từ GitHub Releases và kiểm sha256 trong workflow                |
| GitHub CLI (`gh`)    | 2.x       | `gh auth login`; tạo repo, secret, PR, ruleset từ terminal                |
| Claude Code (Module 8) | 2.1.319 | `claude -p` với `--permission-mode dontAsk`; kiểm ngày 06/11/2026        |

> ⚠️ Nhiều bài hướng dẫn trên mạng dùng cú pháp cũ (`specify init --ai claude`, `/speckit.specify`,
> `/openspec:proposal`). Các cú pháp này **không còn chạy** trên phiên bản hiện tại.
>
> ⚠️ BMAD: docs.bmad-method.org đang viết cho **v7 preview** (`npx skills add ...`, skill `bmad`,
> `bmad-agent-po`); tutorial 2025 dùng `*workflow-init`, `bmad-create-prd`, `bmad-quick-dev`, `bmad-dev-story`.
> Bài lab dùng tên skill của **v6.12.4**: `bmad-prd`, `bmad-ux`, `bmad-architecture`, `bmad-build`,
> `bmad-code-review`...
>
> ⚠️ claude-code-action: tutorial cũ dùng `@beta`, `direct_prompt`, `max_turns`, `allowed_tools`, `model` - đều đã
> bỏ ở v1. Bản v1 dùng `prompt` và gom mọi cờ vào `claude_args`. Thiếu `github_token` thì action đổi sang token của
> Claude GitHub App, mặc định có **quyền ghi code**.
>
> ⚠️ Playwright: ba agent (planner, generator, healer) chỉ có từ bản 1.56, và đã đổi nhiều qua các bản. Bản
> 1.64 sinh `.claude/agents/playwright-test-*.md` + `.mcp.json` (server `playwright-test`), đọc trace bằng
> `npx playwright trace open|actions|action|requests|snapshot <số> --phase after snapshot`. Bài viết trên mạng
> năm 2025 có thể dùng tên tool hoặc cờ cũ.
>
> ⚠️ Agent và MCP: trường `allowed-tools` của skill **không phải hàng rào**, và mỗi công cụ xử lý một kiểu. Từ Claude Code 2.1.302, `-p`
> không đặt `--permission-mode` thì chạy `default`, nhưng settings của máy có thể đổi: luôn ghi rõ. MCP bản 2026-07-28 bỏ bước `initialize`:
> chỉ client hỗ trợ cả hai đời mới tự quay về đời cũ.
