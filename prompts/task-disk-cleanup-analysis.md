# 项目空间分析（只读）

场景：一个 pnpm + Vite + Capacitor Android 项目占了 10 GB / 8 万文件，想知道为什么、哪些能删。用 Chat + 高思考发。

要点：
- 明确 READ-ONLY，删不删看完报告自己决定。
- 先读项目自己的清理规则文档，避免把测试运行器依赖、实验素材当垃圾。
- 检查 git worktree / stash（并行开发留下的 worktree 往往很大）。
- 跨文件系统 du 很慢，后台跑。

```
@runabout The project is at /workspace/<项目路径> (pnpm + Vite + Capacitor Android). It takes about 10 GB (80,000 files). Find out why and what can be safely removed. READ-ONLY: do not delete, move, reset, clean or modify anything.

First read <项目的清理规则/约定文档>. Respect their rules: <哪些目录不是垃圾>; <哪些目录必须逐文件判断，不能整目录删>.

Steps:
1. Measure every top-level item, including hidden folders (.git, .venv, .claude, .cursor). The disk is slow, so run du in the background and read the output when done. Sort largest first.
2. For the 5 largest folders, go one or two levels deeper (e.g. node_modules/.pnpm, android/app/build, android/.gradle, android/build, dist, .claude).
3. Run git worktree list and git stash list. For each worktree, give its path, size, branch, and whether that branch is already merged into the current branch.
4. For .git, run git count-objects -vH and list the 10 largest blobs in history with their paths.
5. Check .gitignore: which big folders are ignored (regenerable) and which are tracked.
6. Find any single file over 50 MB anywhere in the project.

Then give me one table, largest first: path, size, what it is, safe to delete? (yes / yes but needs rebuild / no / unsure), and how to get it back (pnpm install, gradle build, pnpm build, uv sync, etc.). Add the total I could free with only the "yes" and "needs rebuild" rows.

Do not delete anything. I will decide afterwards. Reply in Chinese.
```

结果与后续：待补充。
