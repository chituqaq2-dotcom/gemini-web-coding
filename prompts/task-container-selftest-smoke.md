# 容器自测试手（2026-11-24）

用途：runabout 接入“登记项目 + 登记脚本”白名单后，让 Gemini 第一次在容器里跑测试和 build:workers。只跑不改。新对话，Chat + medium。

```
@runabout Smoke test of the new in-container test runner. Do not edit any file. Work only in /workspace/<项目路径>.

1. Run: pnpm run test:run -- <1-2 个精确测试文件>
2. Run: pnpm run build:workers
3. Run: git status --short
   If worker/amsg/worker.bundle.js is modified, run git diff --stat on it, then restore it with git checkout -- worker/amsg/worker.bundle.js.
4. Run: git fetch --dry-run (just report whether it can reach GitHub; do not pull or push).
5. Do not run the full test suite. Run each command once; if one is rejected by the allowlist, report the exact error and move on.

Report in 5 lines: test result (files/tests passed), build result, git status after restore, git fetch result, any rejected command.
Reply in Chinese.
```

要点：
- 只跑精确文件，别跑全量（Gravity 全量约 1467 文件，本来就有失败）。
- 容器里 build 会改已跟踪的 bundle（路径注释），提交前还原。
