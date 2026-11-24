# 试验场自主修复试手（第四版，2026-11-24）

目的：不提示任何坑，看 Gemini 碰到失败能否自己读报错、修好、重跑到全绿。结果：一次通过（见 docs/08）。

```
@runabout
Work only in /workspace/_sandbox/hello-test3 (create it). Goal: get a green test run on your own.

1. Write strings.mjs exporting slugify(s) and capitalize(s).
2. Write strings.test.mjs with 4 vitest tests, one of them deliberately wrong (expects the wrong value).
3. pnpm init, then install vitest as a dev dependency. Policy: pnpm add must include --ignore-scripts. If the install times out, check package.json and continue.
4. Run pnpm test. It should fail on the wrong test. Fix that test, rerun until everything passes.
5. If any command is rejected or fails, read the error, fix it yourself and retry, at most 3 retries per step. Do not stop to ask me.

Report, short: files created; each test run with pass/fail counts and exit code; every tool error pasted raw; what you changed after each failure.
Reply in Chinese.
```
