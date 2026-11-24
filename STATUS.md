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
8. **容器自测：已上线**（2026-11-24 20:17 正式 runabout 重启，smoke 34/34，天气 5 文件 65 条过，外网 healthz 200）。runabout 本地 main b46d845（未 push）：项目清单 deploy/workspace-projects.yaml + deploy/workspace-project.py（add/sync/list/render），卷 runabout-nm-gravity-ecde3fb7、runabout-pnpm-store；白名单只允许登记目录跑登记脚本（禁 install/add/remove/exec/dlx），依赖变了由宿主跑 `workspace-project.py sync`。Gemini 用法（Gravity 目录内）：`pnpm run test:run -- <文件>`（别跑全量，约 1467 文件、25 个原有/环境失败）、`pnpm run build:workers`。注意：容器里 build:workers 会让已跟踪的 worker/amsg/worker.bundle.js 因路径注释变化，提交前 `git checkout --` 还原或交 Codex 在 Windows 侧重建。全量失败：19 个 Windows 也失败（原有），6 个仅容器（blobRefHook.contract、contextUpstream、gravityBackup、homeAutonomyHook、upstreamFormat、wardrobePickerUI），清单在 runabout deploy/WORKSPACE.md。可接其它项目（低难度）：gemini-quota、PiManager、Sentinel-One、minitool2api、logicc2api-clean。20:28 用户同意加 _sandbox 试验场：/workspace/_sandbox/<子目录> 里 Gemini 可自己 pnpm init/install/add（强制不跑安装脚本）/run/test，不用登记不用重启；指令已交 Codex（会在重启前停下问）。之后用 prompts/task-sandbox-hello-test.md 试手（加一步 pnpm）。Gravity 试手模板 prompts/task-container-selftest-smoke.md 暂缓（项目提交频繁）。

## 用户偏好速记（全文见 docs/09）
- 中文、简短、先结论；少停顿、少确认；小问题自己修、事后说。
- Windows 侧的事全写成 Codex 指令，别让用户粘 PowerShell。
- 删除：先出带编号的清单 → 用户勾选 → 挪回收目录 → 用户自己清空。
- 有用的信息当轮写进本仓库。
