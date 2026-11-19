# Cài đặt môi trường · AI trong SDLC và Coworker

Hướng dẫn này giúp bạn chuẩn bị máy cho **3 ngày học, Module 1 tới Module 8**. Làm xong **trước buổi đầu tiên**, mất khoảng **60–90 phút** (phần lớn là thời gian tải).

Bạn dùng được **macOS, Windows hoặc Linux**, với **Claude** hoặc **Gemini** làm agent chính. Mỗi bước có lệnh riêng cho từng hệ điều hành, chỉ cần làm phần của bạn.

> **Cách đọc nhanh**
> 1. Xem mục 2 để biết bạn cần cài những gì.
> 2. Làm lần lượt Bước 1 → Bước 7.
> 3. Chạy script kiểm tra ở Bước 7, chụp màn hình kết quả gửi trợ giảng.

---

## Mục lục

1. [Lộ trình 3 ngày và công cụ của từng module](#1-lộ-trình-3-ngày-và-công-cụ-của-từng-module)
2. [Bạn cần cài gì](#2-bạn-cần-cài-gì)
3. [Yêu cầu về máy và tài khoản](#3-yêu-cầu-về-máy-và-tài-khoản)
4. [Bước 1 · Công cụ nền: Git, Node.js, uv, GitHub CLI](#bước-1--công-cụ-nền)
5. [Bước 2 · AI agent: Claude Code và/hoặc Gemini CLI](#bước-2--ai-agent)
6. [Bước 3 · Công cụ đặc tả: Spec Kit, OpenSpec, BMAD](#bước-3--công-cụ-đặc-tả)
7. [Bước 4 · Playwright và trình duyệt test](#bước-4--playwright)
8. [Bước 5 · Model review thứ hai và gitleaks](#bước-5--model-review-thứ-hai-và-gitleaks)
9. [Bước 6 · GitHub](#bước-6--github)
10. [Bước 7 · Chạy script kiểm tra](#bước-7--chạy-script-kiểm-tra)
11. [Bảng tra: Claude Code và Gemini CLI](#bảng-tra-claude-code-và-gemini-cli)
12. [Xử lý sự cố](#xử-lý-sự-cố)
13. [Gửi bộ phận IT (mạng công ty)](#gửi-bộ-phận-it)
14. [Checklist cuối cùng](#checklist-cuối-cùng)

---

## 1. Lộ trình 3 ngày và công cụ của từng module

Phiên bản trong bảng là bản **đã ghim trong lab**. Hãy cài đúng bản này để lệnh và kết quả khớp với slide.

| Ngày | Module | Thời lượng | Công cụ chính | Dự án thực hành |
|---|---|---|---|---|
| **1** | **01** · Coding Agent có kiểm soát | 240 phút | Claude Code / Gemini CLI, context file, permission, hook | `helpdesk-legacy` |
| **1** | **02** · Spec Driven Development với Spec Kit | 185 phút | **Spec Kit 1.2** | ShopLite · `lab2-speckit` |
| **2** | **03** · SDD cho source code có sẵn | 120 phút | **OpenSpec 1.14** | Repo lab `03-sdd-brownfield` |
| **2** | **04** · BMAD từ ý tưởng đến backlog | ~215 phút | **BMAD 6.12.4** | ShopLite · `lab4-bmad` |
| **2** | **05** · BMAD từ Story đến AI review code | 145 phút | BMAD 6.12.4, **model thứ hai** để review, Vitest | ShopLite Ops · Sprint 1 |
| **3** | **06** · Test tự động với Playwright và AI | 200 phút | **Playwright 1.64** (planner, generator, healer) | ShopLite · `lab6-e2e` |
| **3** | **07** · CI/CD có AI hỗ trợ | 218 phút | GitHub Actions, claude-code-action, gitleaks 8.30.1 | ShopLite · PR trên GitHub |
| **3** | **08** · Agent và workflow tự động | 120 phút | Claude Code 2.1.319+ (skill, subagent, MCP, hook), chạy không người | ShopLite |

> Dự án xuyên suốt là **ShopLite (Next.js 16)**, dùng từ Module 2 tới Module 8. Giảng viên phát repo và gói lab trước mỗi module, bạn không cần tải trước.

---

## 2. Bạn cần cài gì

### 2.1. Theo agent bạn dùng

| Thành phần | Bạn dùng **Claude** | Bạn dùng **Gemini** |
|---|---|---|
| Agent chính | **Claude Code** | **Gemini CLI** |
| Model review thứ hai (Module 5) | Gemini CLI (đăng nhập Google, miễn phí) | Claude Code (nếu có tài khoản hoặc key giảng viên cấp), nếu không thì Codex CLI |
| Spec Kit | `--integration claude` | `--integration gemini` |
| OpenSpec, BMAD | Chọn **Claude Code** khi cài | Chọn **Gemini CLI** khi cài |
| Playwright agents (Module 6) | `--loop=claude` | Script khởi tạo trong gói lab Module 6 |

> **Lab viết cho Claude Code.** Ở chỗ nào cú pháp Gemini CLI khác, lab có ghi chú riêng. Người dùng Gemini nhớ đọc các ghi chú đó.

**Khuyên dùng:** cài **cả hai** agent. Một agent làm chính, agent kia làm model review ở Module 5. Gemini CLI đăng nhập bằng tài khoản Google cá nhân là dùng được, nên người dùng Claude luôn có sẵn model thứ hai.

### 2.2. Danh sách đầy đủ

| # | Công cụ | Bắt buộc? | Dùng ở module |
|---|---|---|---|
| 1 | Git | ✅ | Tất cả |
| 2 | Node.js 24 LTS (hoặc 22 LTS ≥ 22.13) | ✅ | Tất cả |
| 3 | uv (trình quản lý Python) | ✅ | 2 (Spec Kit) |
| 4 | GitHub CLI (`gh`) | ✅ | 7, 8 |
| 5 | Claude Code **hoặc** Gemini CLI | ✅ (ít nhất một) | Tất cả |
| 6 | Spec Kit (`specify`) 1.2.x | ✅ | 2 |
| 7 | OpenSpec 1.14.1 | ✅ | 3 |
| 8 | BMAD 6.12.4 | Cài trong lớp bằng `npx` | 4, 5, 7 |
| 9 | Chromium cho Playwright 1.64 | ✅ (tải trước) | 6, 7 |
| 10 | Agent thứ hai (Gemini CLI / Claude Code / Codex CLI) | ✅ | 5 |
| 11 | gitleaks 8.30.1 | Không bắt buộc | 7 |
| 12 | VS Code (hoặc editor bạn quen) | Khuyên dùng | Tất cả |
| 13 | Phần mềm chạy container (Rancher Desktop, Docker Engine trong WSL2, hoặc colima) và image runner của lớp | Khuyên dùng | 7 |

---

## 3. Yêu cầu về máy và tài khoản

### 3.1. Máy

| | Tối thiểu | Khuyên dùng |
|---|---|---|
| RAM | 8 GB | 16 GB |
| Ổ trống | 10 GB | 20 GB |
| macOS | 13 trở lên | 14 trở lên, Apple Silicon hoặc Intel |
| Windows | Windows 10 (1809+) | Windows 11 |
| Linux | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 |
| Quyền | Cài phần mềm cho user của bạn | Có quyền admin / sudo |

### 3.2. Tài khoản

- [ ] **GitHub**: có tài khoản, đã bật 2FA. **Gửi username GitHub cho ban tổ chức trước ngày 1**. Ở Module 7 bạn fork repo mẫu về tài khoản này (fork public).
- [ ] **Claude** (nếu dùng Claude): gói Pro, Max, Team hoặc Enterprise; hoặc API key do giảng viên cấp.
- [ ] **Google** (nếu dùng Gemini, hoặc để làm model thứ hai): tài khoản Google. Nếu tài khoản Google Workspace của công ty bị chặn, tạo API key ở Google AI Studio.

> Ở Module 7, GitHub Actions gọi Claude bằng **token từ gói thuê bao của bạn** (lệnh `claude setup-token`, tạo trong lớp ở bài 7.1; mỗi lượt AI tính vào hạn mức gói). Không có gói thuê bao Claude thì dùng API key do giảng viên cấp, đã đặt giới hạn chi phí.

### 3.3. Thư mục làm việc

Tạo một thư mục ngắn, **không dấu tiếng Việt, không khoảng trắng, không nằm trong OneDrive/iCloud**:

| Hệ điều hành | Thư mục gợi ý |
|---|---|
| macOS / Linux | `~/ai-sdlc` |
| Windows | `C:\ai-sdlc` |

> Trên Windows, thư mục `Desktop` và `Documents` thường bị OneDrive đồng bộ. Đồng bộ trong lúc agent ghi file hay gây lỗi khóa file, nên đừng đặt lab ở đó.

### 3.4. Windows: chọn một môi trường và giữ nguyên

Có hai cách, **chọn một và cài mọi thứ ở đó**:

| | **Windows gốc** (khuyên dùng) | **WSL2** |
|---|---|---|
| Terminal | PowerShell | Ubuntu trong WSL |
| Hợp với | Đa số học viên | Người đã quen làm việc trong WSL |
| Làm theo lệnh | Mục **Windows** | Mục **Linux** |

Công cụ cài trên Windows gốc không thấy được trong WSL và ngược lại. Lỗi hay gặp nhất là cài Node trong WSL rồi chạy `claude` ở PowerShell.

---

## Bước 1 · Công cụ nền

### 1.1. Git

<details open>
<summary><b>macOS</b></summary>

```bash
xcode-select --install          # cài Git kèm Command Line Tools
# hoặc nếu đã có Homebrew:
brew install git
```
</details>

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
winget install --id Git.Git -e
```

Cài xong, **đóng và mở lại PowerShell**. Git for Windows có kèm **Git Bash**, cần cho hook ở Module 1 (hook viết bằng bash).
</details>

<details>
<summary><b>Linux (Ubuntu/Debian)</b></summary>

```bash
sudo apt update && sudo apt install -y git curl unzip build-essential
```
</details>

**Cấu hình chung (mọi hệ điều hành):**

```bash
git config --global user.name  "Ho Ten Cua Ban"
git config --global user.email "email@congty.com"
git config --global init.defaultBranch main
```

**Chỉ Windows**, thêm hai dòng này để script `.sh` không bị đổi xuống dòng thành CRLF và để tránh lỗi đường dẫn dài:

```powershell
git config --global core.autocrlf input
git config --global core.longpaths true
```

### 1.2. Node.js

Lab đã chạy thử trên **Node 22 và 24**. Node 26 chưa được thử với các lab.

<details open>
<summary><b>macOS</b></summary>

Dùng `fnm` để cài đúng bản và đổi bản dễ dàng:

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
fnm install 24
fnm default 24
```

Không dùng Homebrew? Tải bộ cài **24.x LTS** ở https://nodejs.org/en/download.
</details>

<details>
<summary><b>Windows</b></summary>

1. Vào https://nodejs.org/en/download, chọn **v24.x (LTS)**, tải file **.msi** và cài.
2. Khi bộ cài hỏi *"Automatically install the necessary tools"*, có thể bỏ qua.
3. Mở PowerShell **mới**.

Nếu PowerShell báo `running scripts is disabled on this system` khi gõ `npm`, chạy một lần:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
</details>

<details>
<summary><b>Linux / WSL2</b></summary>

```bash
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install 24
fnm default 24
```
</details>

**Kiểm tra:**

```bash
node --version    # v24.x.x (hoặc v22.13 trở lên)
npm --version
```

### 1.3. uv (dùng cho Spec Kit)

`uv` tự tải Python khi cần, bạn **không phải cài Python riêng**.

| Hệ điều hành | Lệnh |
|---|---|
| macOS | `brew install uv` |
| Windows | `winget install --id=astral-sh.uv -e` |
| Linux / WSL2 | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |

Mở terminal mới rồi kiểm tra: `uv --version`.

### 1.4. GitHub CLI (`gh`)

| Hệ điều hành | Lệnh |
|---|---|
| macOS | `brew install gh` |
| Windows | `winget install --id GitHub.cli -e` |
| Linux / WSL2 | Làm theo https://github.com/cli/cli/blob/trunk/docs/install_linux.md |

Đăng nhập ở [Bước 6](#bước-6--github).

### 1.5. Editor

Khuyên dùng **VS Code** (https://code.visualstudio.com). Editor nào cũng được, miễn là bạn mở được thư mục dự án và terminal song song.

---

## Bước 2 · AI agent

Cài **ít nhất một**. Nên cài cả hai (xem mục 2.1).

### 2A. Claude Code

<details open>
<summary><b>macOS / Linux / WSL2</b></summary>

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Hoặc trên macOS: `brew install --cask claude-code`
</details>

<details>
<summary><b>Windows (PowerShell, không cần quyền Administrator)</b></summary>

```powershell
irm https://claude.ai/install.ps1 | iex
```

Claude Code dùng **Git Bash** (đã cài ở Bước 1.1) để chạy lệnh và hook. Nếu nó báo không tìm thấy Git Bash, thêm vào `%USERPROFILE%\.claude\settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```
</details>

**Đăng nhập và kiểm tra** (mở terminal mới):

```bash
claude --version      # cần 2.1.319 trở lên
claude                # lần đầu sẽ mở trình duyệt để đăng nhập
```

Trong Claude Code, gõ `/status` để xem bạn đang đăng nhập bằng tài khoản nào, gõ `/exit` để thoát. Nếu dùng **API key giảng viên cấp**, chọn cách đăng nhập bằng Anthropic Console và dán key khi được hỏi.

Bản cài qua lệnh trên tự cập nhật. Nếu bản cũ hơn 2.1.319, chạy `claude update`.

### 2B. Gemini CLI

```bash
npm install -g @google/gemini-cli
# macOS có thể dùng: brew install gemini-cli
```

**Đăng nhập và kiểm tra:**

```bash
gemini --version      # cần 0.64.0 trở lên
gemini                # chọn "Sign in with Google"
```

Nếu tài khoản công ty không đăng nhập được:

1. Tạo API key ở https://aistudio.google.com/apikey.
2. Đặt biến môi trường `GEMINI_API_KEY`:

| Hệ điều hành | Lệnh (lưu lâu dài) |
|---|---|
| macOS (zsh) | `echo 'export GEMINI_API_KEY="..."' >> ~/.zshrc && source ~/.zshrc` |
| Linux / WSL2 | `echo 'export GEMINI_API_KEY="..."' >> ~/.bashrc && source ~/.bashrc` |
| Windows | `setx GEMINI_API_KEY "..."` rồi mở PowerShell mới |

> **Không** commit API key vào repo. Module 1 và Module 7 sẽ kiểm tra chuyện này.

---

## Bước 3 · Công cụ đặc tả

### 3.1. Spec Kit 1.2 (Module 2)

Cài lệnh `specify`, ghim bản 1.2.6:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.2.6
```

Nếu `specify` chưa nhận trong terminal mới, chạy `uv tool update-shell` rồi mở lại terminal.

**Kiểm tra:**

```bash
specify version     # 1.2.6
specify check       # liệt kê agent mà Spec Kit thấy trên máy
```

> Đã có Spec Kit bản khác? Cài đè bằng lệnh trên, thêm `--force`. **Trên Windows đừng dùng `specify self upgrade`**: lệnh này đang có lỗi làm hỏng bản cài. Luôn cài lại bằng `uv tool install ... --force`.

Lệnh dùng trong lớp (chỉ để bạn biết, **không chạy bây giờ**):

| | Claude | Gemini |
|---|---|---|
| Khởi tạo trong repo | `specify init --here --integration claude` | `specify init --here --integration gemini` |
| Lệnh trong agent | `/speckit-specify`, `/speckit-plan`… | Gõ `/speckit` rồi bấm Tab để xem tên chính xác |

Trên Windows gốc, Spec Kit tự chọn script PowerShell. Không cần thêm cờ.

### 3.2. OpenSpec 1.14.1 (Module 3)

OpenSpec cần **Node 20.19 trở lên** (đã có ở Bước 1.2).

```bash
npm install -g @fission-ai/openspec@1.14.1
openspec --version    # 1.14.1
```

Trong lớp bạn sẽ chạy `openspec init` trong repo và chọn **Claude Code** hoặc **Gemini CLI**. Lệnh trong agent có dạng `/opsx:propose`, `/opsx:apply`, `/opsx:archive`.

### 3.3. BMAD 6.12.4 (Module 4, 5)

BMAD **cài vào từng dự án** bằng `npx` trong buổi học, không cài toàn máy. Để buổi học không phải chờ tải, tải sẵn gói về cache:

```bash
npm cache add bmad-method@6.12.4
```

Trong lớp bạn sẽ chạy `npx bmad-method@6.12.4 install` và chọn **Claude Code** hoặc **Gemini CLI** khi trình cài hỏi IDE/agent. Hãy gõ đúng `@6.12.4`, đừng dùng `@latest`.

---

## Bước 4 · Playwright

Playwright được cài vào repo ShopLite trong lớp. Riêng trình duyệt Chromium (~150 MB) nên **tải trước ngay bây giờ**:

<details open>
<summary><b>macOS / Windows</b></summary>

```bash
npx -y playwright@1.64.0 install chromium
```
</details>

<details>
<summary><b>Linux / WSL2</b> (cần thêm thư viện hệ thống)</summary>

```bash
npx -y playwright@1.64.0 install --with-deps chromium
```

Lệnh sẽ hỏi mật khẩu sudo để cài thư viện.
</details>

Trình duyệt được lưu ở:

| Hệ điều hành | Thư mục |
|---|---|
| macOS | `~/Library/Caches/ms-playwright` |
| Windows | `%USERPROFILE%\AppData\Local\ms-playwright` |
| Linux / WSL2 | `~/.cache/ms-playwright` |

> **WSL2:** chế độ `--ui` và `--headed` của Playwright cần hiển thị cửa sổ. Windows 11 hỗ trợ sẵn (WSLg). Trên Windows 10, bạn chỉ chạy được chế độ headless, và nên chuyển sang Windows gốc.

---

## Bước 5 · Model review thứ hai và gitleaks

### 5.1. Model thứ hai (Module 5)

Ở Module 5, một model **khác** với model đã viết code sẽ review code. Chọn theo bảng:

| Agent chính của bạn | Model review | Cần làm |
|---|---|---|
| Claude Code | **Gemini CLI** | Làm Bước 2B |
| Gemini CLI | **Claude Code** | Làm Bước 2A (tài khoản Claude hoặc key giảng viên cấp) |
| Gemini CLI, không có Claude | **Codex CLI** | `npm install -g @openai/codex`, đăng nhập bằng tài khoản ChatGPT |

### 5.2. gitleaks (không bắt buộc)

Ở Module 7, gitleaks chạy trên GitHub Actions. Cài thêm trên máy nếu bạn muốn quét thử trước khi push.

| Hệ điều hành | Cách cài |
|---|---|
| macOS | `brew install gitleaks` |
| Windows / Linux | Tải bản **v8.30.1** ở https://github.com/gitleaks/gitleaks/releases, giải nén, đặt file chạy vào thư mục có trong PATH |

### 5.3. Phần mềm chạy container và image runner (Module 7, khuyên dùng)

Ở Module 7, job AI review chạy trong một **runner bạn dựng bằng container** trên máy mình. Không chạy được container thì job đó chạy trên máy của GitHub, bạn vẫn làm được lab.

Lab chỉ cần lệnh `docker` chạy được container Linux. Khóa học **không dùng Docker Desktop**, vì phần mềm đó cần giấy phép trả tiền ở nhiều tổ chức; máy đã cài sẵn thì thoát hẳn nó trước khi làm các bước dưới. Dùng một trong các lựa chọn mã nguồn mở sau, chọn theo môi trường của bạn:

| Môi trường của bạn (mục 3.4) | Dùng | Giấy phép |
|---|---|---|
| **Windows gốc** (PowerShell, Git Bash) | **Rancher Desktop**, chọn engine `dockerd (moby)` | Apache-2.0 |
| **WSL2** (Ubuntu) | **Docker Engine** cài trong Ubuntu của WSL2 | Apache-2.0 |
| **macOS** | **colima** (hoặc Rancher Desktop) | MIT |
| **Linux** | **Docker Engine** | Apache-2.0 |

> ⚠️ Lab đã chạy thử trọn bài với **colima trên macOS (chip Apple)**. Image cũng đã build và kiểm công cụ trên Docker Engine, Linux x64 (máy của GitHub). Rancher Desktop trên Windows và Docker Engine trong WSL2 viết theo tài liệu chính thức, **chưa chạy thử**: báo trợ giảng nếu có bước không khớp.

#### A. Windows gốc: Rancher Desktop

Cần Windows 11 đã cập nhật, máy bật ảo hóa, và **WSL đã cài trước** (`wsl --install` trong PowerShell quyền admin, rồi khởi động lại). Nên có 8 GB RAM và 4 CPU.

1. Tải file `Rancher.Desktop.Setup.X.Y.Z.msi` ở <https://github.com/rancher-sandbox/rancher-desktop/releases> (bản khi soạn bài: 1.25.0) và chạy. Chọn cài cho mọi người dùng nếu được hỏi.
2. Mở Rancher Desktop. Trong **Preferences › Container Engine › General** chọn **dockerd (moby)**: lựa chọn này mới cho lệnh `docker`. (Lựa chọn còn lại, `containerd`, dùng lệnh `nerdctl`, lab không dùng.)
3. Trong **Preferences › Kubernetes** bỏ tick **Enable Kubernetes**: lab không cần Kubernetes, tắt đi cho nhẹ máy. Ứng dụng tự khởi động lại.
4. Mở một cửa sổ **Git Bash mới** và kiểm tra ở mục "Kiểm tra" bên dưới.

Máy Windows 10, hoặc không cài được Rancher Desktop: cài Ubuntu trong WSL2 rồi làm theo mục B. Khi đó phần runner của bài 7.3 gõ trong cửa sổ Ubuntu, phần còn lại của lab vẫn gõ trong Git Bash (bài 7.3 có ghi rõ).

#### B. WSL2 hoặc Linux: Docker Engine

Gõ trong Ubuntu (22.04, 24.04 hoặc mới hơn). Trên Windows: đây là cửa sổ Ubuntu của WSL2, không phải PowerShell.

```bash
# Kho apt chính thức của Docker
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update

# Cài Docker Engine, cho user của bạn dùng docker không cần sudo
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin
sudo usermod -aG docker $USER
newgrp docker                        # hoặc đóng rồi mở lại cửa sổ Ubuntu
sudo systemctl enable --now docker.service
```

Riêng với WSL2:

- `systemctl` báo lỗi nghĩa là bản Ubuntu của bạn chưa bật systemd (Ubuntu cài bằng `wsl --install` gần đây đã bật sẵn). Thêm hai dòng `[boot]` và `systemd=true` vào `/etc/wsl.conf`, chạy `wsl.exe --shutdown` trong PowerShell, rồi mở lại Ubuntu.
- **Giữ một cửa sổ Ubuntu mở trong suốt giờ lab.** Dịch vụ systemd không giữ cho WSL sống: khi không còn cửa sổ nào mở, WSL có thể tắt bản Ubuntu dù Docker đang chạy; runner tắt theo và job AI review đứng ở "Queued".

Nhóm `docker` cho user quyền ngang root trên máy đó. Với máy cá nhân dùng cho lab thì chấp nhận được.

#### C. macOS: colima

```bash
brew install colima docker
colima start                         # chạy lại lệnh này sau mỗi lần khởi động máy
```

Muốn dùng Rancher Desktop trên macOS (13 trở lên): tải file `.dmg` ở trang releases ở mục A, rồi làm bước 2 và 3 của mục A.

#### Kiểm tra (mọi môi trường)

```bash
docker version                       # có cả phần Client và phần Server
docker run --rm hello-world          # phải in "Hello from Docker!"
```

#### Build image runner ở nhà

Image nặng **3,5 GB (máy ARM64) tới 3,9 GB (máy x64)**, build mất 10-15 phút với mạng nhà: **build ở nhà**, đừng build trên Wi-Fi của lớp. Giảng viên phát file `Dockerfile` cùng gói lab Module 7 (`module-7-cicd-ai/reference/runner/`). Người dùng WSL2 có gói lab nằm trên ổ Windows thì đường dẫn có dạng `/mnt/c/ai-sdlc/lab-guides/module-7-cicd-ai/reference/runner`.

```bash
docker build -t shoplite-runner <thư mục chứa Dockerfile>
docker run --rm shoplite-runner bash -c 'node --version; gh --version | head -1; ~/.local/bin/claude --version; ~/.bun/bin/bun --version'
```

Kết quả mong đợi: `v22.…`, `gh version 2.…`, `2.1.309 (Claude Code)`, `1.3.14`. Lệnh build dừng với `curl: (18) Transferred a partial file` thì chạy lại, các bước đã xong được dùng lại.

---

## Bước 6 · GitHub

```bash
gh auth login
```

Chọn lần lượt: **GitHub.com** → **HTTPS** → **Yes** (dùng làm credential cho Git) → **Login with a web browser**.

**Kiểm tra:**

```bash
gh auth status        # phải thấy "Logged in to github.com"
git ls-remote https://github.com/github/spec-kit.git HEAD   # phải in ra một mã commit
```

Kiểm tra bạn thấy được repo mẫu của lớp (Module 7 sẽ fork repo này):

```bash
gh repo view trandinhduc/shoplite --json name,visibility --jq '"\(.name) \(.visibility)"'   # shoplite PUBLIC
```

---

## Bước 7 · Chạy script kiểm tra

Tải file `kiem-tra-moi-truong.mjs` (đi kèm tài liệu này) vào thư mục làm việc (`~/ai-sdlc` hoặc `C:\ai-sdlc`), rồi chạy:

```bash
cd ~/ai-sdlc                         # Windows: cd C:\ai-sdlc
node kiem-tra-moi-truong.mjs
```

Mặc định script chỉ đòi **ít nhất một** agent. Muốn chắc agent chính của bạn đạt đúng phiên bản, nói rõ agent đó:

```bash
node kiem-tra-moi-truong.mjs --agent claude
node kiem-tra-moi-truong.mjs --agent gemini
```

Script **chỉ đọc**, không cài và không sửa gì trên máy. Kết quả có ba mức:

| Ký hiệu | Ý nghĩa | Việc cần làm |
|---|---|---|
| `[ OK ]` | Đạt | Không cần làm gì |
| `[CẢNH]` | Chạy được nhưng nên sửa | Đọc gợi ý bên dưới dòng đó |
| `[LỖI ]` | Thiếu hoặc sai, lab sẽ không chạy | Sửa theo gợi ý, chạy lại script |

**Chụp màn hình kết quả cuối cùng** và gửi trợ giảng trước ngày học.

---

## Bảng tra: Claude Code và Gemini CLI

| Việc | Claude Code | Gemini CLI |
|---|---|---|
| Context file cho dự án | `CLAUDE.md` | `GEMINI.md` |
| Cấu hình dự án (permission, hook) | `.claude/settings.json` | `.gemini/settings.json` |
| Cấu hình MCP server | `.mcp.json` | Khóa `mcpServers` trong `.gemini/settings.json` |
| Chạy không cần người (Module 8) | `claude -p "..."` | `gemini -p "..."` |
| Xem lệnh có sẵn | `/help` | `/help` |
| Spec Kit | `--integration claude` | `--integration gemini` |
| Playwright agents | `npx playwright init-agents --loop=claude` | Script khởi tạo trong gói lab Module 6 |
| GitHub Actions (Module 7) | `anthropics/claude-code-action` | `google-github-actions/run-gemini-cli` |

Cả hai đều đọc được `AGENTS.md` khi lab yêu cầu. Lab chỉ cách cấu hình ở Module 1.

---

## Xử lý sự cố

### Mọi hệ điều hành

| Triệu chứng | Nguyên nhân hay gặp | Cách sửa |
|---|---|---|
| `command not found` / `not recognized` ngay sau khi cài | Terminal cũ chưa nạp PATH mới | Đóng hết terminal, mở terminal mới |
| `npm install -g` báo `EACCES` (macOS/Linux) | Node cài bằng sudo/hệ thống | Cài lại Node bằng `fnm` (Bước 1.2), **không** dùng `sudo npm` |
| `node --version` vẫn ra bản cũ | Có hai bản Node trên máy | macOS/Linux: `which -a node`; Windows: `where.exe node`. Gỡ bản thừa |
| OpenSpec báo lỗi khi chạy | Node dưới 20.19 | Nâng Node (Bước 1.2) |
| `npx` treo lâu hoặc lỗi mạng | Proxy công ty | Xem [Gửi bộ phận IT](#gửi-bộ-phận-it). Có proxy thì `npm config set proxy http://...` và `npm config set https-proxy http://...` |
| `specify` không có sau khi cài | Thư mục tool của uv chưa vào PATH | `uv tool update-shell`, mở terminal mới |
| Cổng 3000 đang bận | Có app khác đang chạy | Tắt app đó, hoặc làm theo hướng dẫn đổi cổng trong lab |

### macOS

| Triệu chứng | Cách sửa |
|---|---|
| `xcrun: error: invalid active developer path` | `xcode-select --install` |
| Lệnh Homebrew không có | Cài Homebrew ở https://brew.sh |

### Windows

| Triệu chứng | Cách sửa |
|---|---|
| `running scripts is disabled on this system` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Hook ở Module 1 báo `bad interpreter` hoặc `$'\r'` | Lỗi CRLF. Chạy `git config --global core.autocrlf input`, clone lại repo |
| Claude Code không tìm thấy Git Bash | Thêm `CLAUDE_CODE_GIT_BASH_PATH` (Bước 2A) |
| Lỗi `EBUSY` / `EPERM` khi agent ghi file | Thư mục nằm trong OneDrive hoặc antivirus đang quét. Chuyển sang `C:\ai-sdlc` |
| Lệnh có trong WSL nhưng không có ở PowerShell (hoặc ngược lại) | Bạn đang trộn hai môi trường. Xem mục 3.4 |
| `winget` không có | Cài **App Installer** từ Microsoft Store |

### Linux

| Triệu chứng | Cách sửa |
|---|---|
| Playwright báo thiếu thư viện (`libnss3`, `libatk`…) | `npx -y playwright@1.64.0 install-deps chromium` |
| Không mở được trình duyệt để đăng nhập (máy không có giao diện) | Claude Code và Gemini CLI in ra một đường link: mở link đó trên máy khác, dán mã trả về vào terminal |

---

## Gửi bộ phận IT

Nếu học trên mạng công ty có tường lửa hoặc proxy, gửi danh sách này cho IT **ít nhất 3 ngày trước khóa học**:

| Mục đích | Tên miền |
|---|---|
| Claude | `claude.ai`, `*.anthropic.com`, `*.claude.com` |
| Gemini | `accounts.google.com`, `*.googleapis.com`, `aistudio.google.com` |
| npm | `registry.npmjs.org` |
| GitHub | `github.com`, `api.github.com`, `*.githubusercontent.com`, `*.actions.githubusercontent.com` (runner của Module 7) |
| uv / Python | `astral.sh`, `pypi.org`, `files.pythonhosted.org` |
| Playwright | `cdn.playwright.dev`, `playwright.download.prss.microsoft.com` |
| Node / fnm | `nodejs.org`, `fnm.vercel.app` |

Dự phòng: nếu mạng công ty không mở được, phát Wi-Fi từ điện thoại.

---

## Checklist cuối cùng

Tick hết trước buổi học đầu tiên:

**Máy và tài khoản**
- [ ] Đã tạo thư mục `~/ai-sdlc` hoặc `C:\ai-sdlc`
- [ ] Đã gửi username GitHub cho ban tổ chức
- [ ] (Windows) Đã chọn Windows gốc **hoặc** WSL2 và cài mọi thứ ở cùng một chỗ

**Công cụ**
- [ ] `git --version`, đã đặt `user.name` và `user.email`
- [ ] `node --version` ra v24.x (hoặc v22.13+)
- [ ] `uv --version`
- [ ] `gh auth status` báo đã đăng nhập
- [ ] `claude --version` ≥ 2.1.319 **và/hoặc** `gemini --version` ≥ 0.64.0, đã đăng nhập
- [ ] `specify version` ra 1.2.6
- [ ] `openspec --version` ra 1.14.1
- [ ] Đã chạy `npm cache add bmad-method@6.12.4`
- [ ] Đã tải Chromium cho Playwright 1.64.0
- [ ] Có model thứ hai cho Module 5
- [ ] (Module 7, nếu máy chạy được container) `docker run --rm hello-world` chạy được và `docker images shoplite-runner` có image đã build

**Kiểm tra**
- [ ] `node kiem-tra-moi-truong.mjs` không còn dòng `[LỖI ]`
- [ ] Đã gửi ảnh chụp kết quả cho trợ giảng

Hẹn gặp bạn ở buổi học. 🚀
