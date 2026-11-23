# 磁盘清理第一步（只清零副作用部分，先移到回收目录）

配合 `task-disk-cleanup-analysis.md` 使用：先让 Gemini 出只读分析表，人看过后再发这一份。
要点：不直接 rm，先 mv 到仓库外的回收目录；带 Git 追踪文件或敏感文件的目录一律跳过；最近改动过的 git 临时包跳过。
用 Chat + medium 即可。`<PROJECT>` 换成项目路径，排除名单按你自己的分析表改。

```
@runabout Work only in /workspace/<PROJECT>. This is CLEANUP STEP 1. Only MOVE files, never rm. Keep command output short (pipe through sort | head). Do not touch anything not listed below.

Trash dir: /workspace/_trash/<PROJECT-NAME>-20261123/ (outside the repo). Recreate the same relative paths inside it.

Hard rules (skip and report, never move):
- Any path that contains a Git-tracked file (check with `git ls-files -- <path> | head -1`).
- Any path containing files matching *.private*, *.aesgcm, *.pem, *.key, *key*.private, *.sql, *.env, *backup*.
- output/release/, output/apk-delivery/, every output/a23-*release* dir, output/cardigan-controller, output/sailor-school, output/sailor-girl, output/clothing-rebuild-0920.
- Anything in node_modules, dist, android, .venv, public, art, src code dirs.

Move these:
1. In each history task dir under output/ (except the excluded ones above): only the build-snapshot subdirs named pre-build, before, web*, capacitor*, final-dist, *-dist, plus *.apk and *.zip files directly inside the task dir. Keep logs and text files.
2. output/a24-c1-20260927/ (whole dir, after the sensitive-file check).
3. output/a23-s1-test-databases/ and output/a23-s2-test-databases/.
4. .git/objects/pack/tmp_pack_* — only files last modified more than 2 hours ago. Skip newer ones and report them.

Steps:
A. First print a dry-run list: path, size, reason (one line each), and a skipped list with the rule that blocked it. Then do the moves in the same run.
B. After moving, run `git status --short | head` and `git count-objects -vH` and confirm: no tracked file changed, garbage count went down.
C. Print totals: moved size, skipped items, project size before/after (du -sh).
D. Write the moved list to /workspace/_trash/<PROJECT-NAME>-20261123/MANIFEST.txt.

Do not empty the trash. Reply in Chinese, short.
```

确认项目能正常 `pnpm build`、打开没问题后，再自己清空回收目录（或让 Gemini 清）：

```
@runabout Delete /workspace/_trash/<PROJECT-NAME>-20261123 completely, then show `du -sh /workspace/_trash`. Reply in Chinese.
```
