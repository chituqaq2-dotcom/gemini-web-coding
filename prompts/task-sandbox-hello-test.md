# 零依赖新项目试手（2026-11-24）

用途：不碰真实项目，验证 Gemini 能在容器里写代码并跑测试。未登记项目不能用 pnpm/npm、不能装依赖，所以只用 Node 自带 node:test。新对话，Chat + medium。

```
@runabout Create a tiny test project to check that you can write code and run tests inside the container. Touch nothing outside /workspace/_sandbox/hello-test.

1. mkdir -p /workspace/_sandbox/hello-test and work only there.
2. Write calc.mjs exporting add(a, b) and divide(a, b) (divide throws on b === 0).
3. Write calc.test.mjs using only node:test and node:assert, with 4 tests: add, divide, divide by zero throws, and one test that should fail on purpose (expect add(1, 1) to be 3).
4. Run: node --test calc.test.mjs. Expect 3 pass, 1 fail.
5. Fix the wrong test (expect 2), run it again. Expect 4 pass.
6. No npm, no pnpm, no packages. Run each command at most twice; if the allowlist rejects one, report the exact error.

Report in 4 lines: files created, first run result, second run result, any rejected command.
Reply in Chinese.
```

要测 pnpm 登记那套：让 Codex 在宿主跑 `workspace-project.py add <路径>` 并重启 runabout。容器里不能 rm，试完的目录交用户挪回收目录。

## 加测 pnpm（试验场上线后，2c8c807 起）
在上面指令第 5 步后插入：

```
6. In the same folder run: pnpm init, then pnpm add -D vitest. Write calc.vitest.test.mjs with the same 3 correct tests using vitest, add "test": "vitest run" to package.json scripts, then run pnpm test. Expect 3 pass.
```
