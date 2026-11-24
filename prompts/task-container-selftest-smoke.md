# 容器自测试手（2026-11-24）

用途：runabout 接入“登记项目 + 登记脚本”白名单后，让 Gemini 第一次在容器里跑测试和 build:workers。只跑不改。新对话，Chat + medium。

```
@runabout Smoke test of the new in-container test runner. Do not edit any file. Work only in /workspace/<项目路径>.

1. Run git status --short and git log --oneline -1. Note whether worker/amsg/worker.bundle.js is already modified.
2. Run ls utils/*weather*.test.ts, pick two of them, and run: pnpm run test:run -- <those two files>
3. Run: pnpm run build:workers
4. Run git status --short again. If worker/amsg/worker.bundle.js was clean in step 1 and is modified now, run git diff --stat on it, then git checkout -- worker/amsg/worker.bundle.js. If it was already modified in step 1, do not touch it.
5. Run: git fetch --dry-run (only report whether it reaches GitHub; no pull, no push).
6. Do not run the full test suite. Run each command once; if the allowlist rejects one, report the exact error and move on.

Report in 5 lines: HEAD, test result, build result, git status at the end, git fetch result and any rejected command.
Reply in Chinese.
```

要点：
- 只跑精确文件，别跑全量（Gravity 全量约 1467 文件，本来就有失败）。
- 容器里 build 会改已跟踪的 bundle（路径注释），提交前还原。
- 项目提交频繁：先记 git status，只在构建前干净时才还原 bundle，防止冲掉未提交改动；测试文件名用 ls 现取，别写死。
