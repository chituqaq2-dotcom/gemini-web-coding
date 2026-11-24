# 现状与待办（接手时先看这里）

最后更新：2026-11-24 17:41（北京时间）。11-23～24 的逐条流水见 [docs/history/STATUS-2026-11-23至24-流水.md](docs/history/STATUS-2026-11-23至24-流水.md)，只在需要查细节时看。

## 一句话现状
整套流程可正常使用：用户在 Gemini 网页（Neon）里 @runabout 改代码；Windows 侧测试/提交/部署交本地 agent（Codex）；我（Hark）写指令、判结果、记账、维护本仓库。进行中：Gemini 容器内自测（多项目通用），见挂着的事第 8 条。

## 已就绪
- **runabout**（用户 Windows 电脑，WSL2 Ubuntu-24.04 + Docker，源码 `~/runabout`，本地 main HEAD b581801，未 push 到上游）
  - 只挂载 D:\Projects → 容器内 `/workspace`。
  - 能出网：独立代理转发服务把 Windows 代理转进容器（2026-11-24）。
  - 命令白名单（防手滑，不是安全边界）：git 安全子命令、node/python3 只跑工作区脚本、pnpm/npx 限定、curl、mkdir/cp/mv/touch/diff/sed/awk/xargs/tee/tar/unzip、只读工具。**拒绝**：rm、rmdir、find -delete、shred、sed -i、python3 -c/-m、node -e、白名单外命令、/workspace 外路径、双引号里的 `$变量` 和反引号。
  - 复合命令（&&、|、;）任一段被拒，整条都不执行；报错会指出是哪一段哪个参数。
  - 容器里 git 已设 core.autocrlf=true、filemode=false（环境变量，不动仓库 .git/config），Gravity `git status` 约 2 秒、与 Windows 一致。
  - 本地未提交补丁：`internal/tools/shell.go` 的 OpenWorldHint=false（docs/05 第 24 条）。
  - 升级：不再用 `git pull --ff-only`；按 runabout 仓库 `deploy/WORKSPACE.md`（fetch → rebase origin/main → 重建 → 跑 `deploy/smoke-workspace.py`）。重启会打断 Gemini 任务，先问用户。
- **额度读数**：油猴脚本 1.3.0 + 只读接口，Hark 有 Home 额度面板（详见 AGENTS §0、§5）。
- **Gravity 天气 bug1**：已修好上线（gravity 分支合并 c26c9494，网页构建 mwtery49-c26c949，2026-11-23 23:40 用户验收）。手机 APK 下次打包才带上。

## 挂着的事（都不急）
1. Gravity 手机 APK：下次打包时带上天气修复。
2. newapi-checkin：`.secret/key.txt`（51 字节，无代码引用）等用户自己看，若是在用令牌就存进密码管理器再挪走。
3. 回收目录 `D:\Projects\_trash\`（runabout-check-20261124、newapi-checkin-20261124 约 205 MiB）：用户自己清空。
4. Gravity 根目录未入库的 `docs.zip`（9.8MB）：用户说不用管。
5. 待试：Gemini 用 Task 模式做一个交代清楚的长任务，看能否比 Chat 跑更久、额度如何。
6. 待试：Gemini 在 runabout 里 `git fetch --dry-run` 连 GitHub（现在能出网了，大概率可行）；行的话简单推拉可不经 Codex。
7. 想法：让 Gemini 直接跑 Windows 侧测试（经 runabout 调 powershell）——**暂不做**，runabout 已刻意不开 Windows 互操作；需要时重新评估安全。
8. **进行中**（2026-11-24 15:30 用户同意，指令已交 Codex，重启前会停下问）：给 runabout 容器装 Node+pnpm、另放一份 Linux 依赖（不碰 Windows 的 node_modules，esbuild/rollup 有平台二进制），让 Gemini 改完自己跑测试。push/发布不做（令牌放进 Gemini 能碰的容器有泄露风险），APK 不做（要安卓 SDK），仍交 Codex。15:33 用户要求多项目通用：按配置文件列项目、每个项目一个脚本建 Linux 依赖卷+白名单；Codex 先接 Gravity，并扫 D:\Projects 列出其它有测试的项目（只列不接）。17:41 用户：Codex 仍在做，尚无回报；回报到了再更新这里。 18:49：Codex 跑了一下午没收尾（中途模型多次 capacity 报错、换到 DeepSeek V4.1 Flash）。已完成大半：通用项目清单+workspace-project.py、镜像装 Node/pnpm、预检容器里装好 Linux 依赖并跑完全量测试（1467 文件，25～26 个失败，正在逐个和 Windows 对比）。注意：之前指令写的“14 文件 136 条”只是天气子集，全量本来就多，验收应改为“容器失败集 ⊆ Windows 失败集”。用户换更强模型接手，交接指令要求先看 ~/runabout 未提交改动、别重来。

## 用户偏好速记（全文见 docs/09）
- 中文、简短、先结论；少停顿、少确认；小问题自己修、事后说。
- Windows 侧的事全写成 Codex 指令，别让用户粘 PowerShell。
- 删除：先出带编号的清单 → 用户勾选 → 挪回收目录 → 用户自己清空。
- 有用的信息当轮写进本仓库。
