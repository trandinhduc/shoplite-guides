# Runner của lớp cho job AI review (Module 7). Đã build và chạy thử trên linux/arm64.
#   docker build -t shoplite-runner .
ARG RUNNER_VERSION=2.338.2
ARG NODE_VERSION=22.23.5
FROM node:${NODE_VERSION}-bookworm-slim AS node

FROM ghcr.io/actions/actions-runner:${RUNNER_VERSION}
# Ba giá trị dưới đây phải khớp với claude-code-action đang ghim trong ai-review.yml (v1.0.259).
# Log của action in ra đúng các số này: "bun-version: ..." và "Installing Claude Code v...".
ARG CLAUDE_CODE_VERSION=2.1.309
ARG BUN_VERSION=1.3.14
ARG CLAUDE_CODE_ACTION_SHA=ae68417a745a5df4b2124873632bd73a2255e6f6

# Node cho bước chuẩn bị bối cảnh (node .ci/quet-cau-moi.mjs); image gốc không có.
COPY --from=node /usr/local/bin/node /usr/local/bin/node

# GitHub CLI cho AI đăng comment tổng hợp (gh pr comment); image gốc không có.
USER root
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      > /etc/apt/sources.list.d/github-cli.list \
 && apt-get update && apt-get install -y --no-install-recommends gh \
 && rm -rf /var/lib/apt/lists/*
USER runner

# Claude Code cài sẵn: action tải lại 280 MB ở mỗi lần chạy nếu không trỏ path_to_claude_code_executable vào đây.
RUN curl -fsSL https://claude.ai/install.sh | bash -s "${CLAUDE_CODE_VERSION}"

# Bun và các gói của action nạp sẵn vào ~/.bun: lần review đầu trên container mới không phải tải khoảng 700 MB.
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}" \
 && mkdir /tmp/cca && cd /tmp/cca && git init -q \
 && git fetch -q --depth 1 https://github.com/anthropics/claude-code-action "${CLAUDE_CODE_ACTION_SHA}" \
 && git checkout -q FETCH_HEAD \
 && "$HOME/.bun/bin/bun" install --production \
 && cd / && rm -rf /tmp/cca
