# 现状与待办（接手时先看这里）

最后更新：2026-11-25 11:15（北京时间）。更早的逐条流水见 [docs/history/STATUS-2026-11-23至24-流水.md](docs/history/STATUS-2026-11-23至24-流水.md)，只在需要查细节时看。

## 一句话现状
整套流程可正常使用：用户在 Gemini 网页（Neon）里 @runabout 写代码、跑测试；Windows/WSL 侧的改动交本地 agent（Codex）；Hark 写指令、判结果、读额度、记账、维护本仓库。当前主线：在 `_sandbox` 试验场里一步步验证 Gemini 能独立写代码和自测（六轮已过，见 docs/08），批量工具已上线并实测通过（第七版一轮 6 次调用），下一步用真实项目任务积累样本：第一个是用户的 Crescendo-Bid（投标文件工具，私有项目），11-25 Gemini 已做完只读诊断（2 轮共 36 次调用、10%），等 runabout 放开后让它直接改代码。Gemini 网页全局指令 11-25 已存，提示词只写任务。

## 已就绪
- **runabout**（用户 Windows 电脑，WSL2 Ubuntu-24.04 + Docker，源码 `~/runabout`，本地 main，未 push 到上游；重启会打断 Gemini 任务，先问用户）
  - 只挂载 D:\Projects → 容器内 `/workspace`；能出网（代理转发服务）；容器 git 设了 autocrlf=true、filemode=false（环境变量）。
  - 对 Gemini 暴露的工具（11-25 Codex 核对）：shell、shell_output、shell_kill、read、apply_patch、search、glob（write 代码里有但未注册）、write_files、read_files、run_commands（批量，11-25 上线）。
  - 命令白名单（防手滑，不是安全边界）：git 安全子命令、node/python3 只跑工作区脚本、pnpm/npx 限定、curl、mkdir/cp/mv/touch/diff/sed/awk/xargs/tee/tar/unzip、只读工具。**拒绝**：rm、rmdir、find -delete、shred、sed -i、python3 -c/-m、node -e、白名单外命令、/workspace 外路径、双引号里的 `$变量` 和反引号。复合命令任一段被拒整条不执行，报错指出哪一段。
  - **登记项目**（deploy/workspace-projects.yaml + workspace-project.py add/sync/list/render）：目前只有 Gravity，只能跑 `pnpm run test:run -- <文件>`（别跑全量，约 1467 个文件）和 `pnpm run build:workers`；依赖变了由宿主跑 `workspace-project.py sync`。容器里 build:workers 会改动已跟踪的 worker/amsg/worker.bundle.js（路径注释），提交前还原。
  - **`/workspace/_sandbox/<子目录>` 试验场**：不用登记不用重启，Gemini 可自己 `pnpm init/install/add/run/test/pkg`（pkg 允许 get/set/delete，11-25 放行；install/add 必须显式带 `--ignore-scripts`，否则被拒；dlx/exec/-g/试验场外拒绝），`node --version`、`node <文件>`、`node --test <文件>`（文件须在本试验项目内）。node_modules 是 Linux 格式，Windows 侧别用。
  - 隧道：cloudflared 钉版本 + `--protocol http2`（11-25 修偶发 URL_UNREACHABLE，runabout 本地提交，只重启了隧道容器）。观察是否复发。
  - smoke 前置：需要 /workspace/_sandbox/node-check 目录存在（11-25 重启时缺失导致 smoke 首次失败）。
  - 升级：按 runabout 的 deploy/WORKSPACE.md（fetch → rebase origin/main → 重建 → 跑 smoke）。注意：11-24 那次镜像是把新 Go 二进制换进现有镜像，暂不能从 Dockerfile 原样重建；下次正常 build 要确认 Node 层能下完。
- **额度读数**：油猴脚本把 usage 页读数推到只读接口 `/latest`（地址和密钥不在本仓库），Hark 任务后自己读（规则见 docs/09 末节），Hark Home 有每小时刷新的额度面板。
- **自动点 Allow 脚本** userscripts/gemini-auto-allow.user.js 1.1.1（Tampermonkey，按 @updateURL 自动更新）：只点 runabout 卡片的 Always allow。1.0 实测没点；1.1.x 尚未在真实权限卡上验证。失败时请用户贴控制台 `[auto-allow]` 开头的日志。每次点击算一轮额度。

## 待办（按优先级）
1. **runabout 批量工具**（11-25）：Codex 已写好 write_files（本机路径，复用 CheckWrite，≤20 个/1MB，先全量校验再写）、read_files（≤20 个）、run_commands（≤10 条，逐条过白名单，stop_on_error，整批超时 3 倍），注册进工具列表并写了单测。已上线：本地提交 3ed1fd2，11-25 01:2x 正常 compose 重建重启（Node 层约 4 分钟，没走备用方案），smoke 34/34，外网 healthz 200。（用本机 golang 1.25 镜像测：gofmt、go vet 通过，internal/tools 113/113；internal 全量另有 1 个既有失败 TestConfirms，root 下 $HOME/.. 判 deny，与本次无关）。本地直连 /mcp 会 401（要 OAuth），Gemini 实测已过（第七版：一轮 6 次调用，6%，见 docs/08）。第七版发现试验场不让 `pnpm pkg`（Gemini 绕道 apply_patch），11-25 10:27 已放行并重启（本地提交 509a978，smoke 34/34，外网 healthz 200），本条完成。
2. 自动点 Allow 1.1.1 在真实权限卡上验证。
3. 试验场下一步可试：Task 模式长任务能否跑更久；`git fetch --dry-run` 能否直连 GitHub（能的话简单推拉可不经 Codex）。
4. **放开 runabout 限制**（11-25 10:58 用户要求，指令已给 Codex，待回报）：去掉命令白名单和项目登记，/workspace 下任意目录可读写、任意命令（含 rm、git push、python -m、pip、pnpm 跑脚本），只保留“容器只挂 D:\Projects”这一道；镜像补 python3-venv/pip；备份 tag runabout:backup-before-open-20261125。完成后改写上面“命令白名单”“登记项目”“试验场”几条和 AGENTS.md 第 3 节相关条目。
5. Gravity 6 个仅容器失败的测试（blobRefHook.contract、contextUpstream、gravityBackup、homeAutonomyHook、upstreamFormat、wardrobePickerUI，清单在 runabout deploy/WORKSPACE.md）：未查；用户说试验阶段别把 Gravity 拉进来。
6. Gravity 手机 APK：下次打包时带上天气修复（网页已上线，11-23 验收）。

## 等用户自己处理（不用催）
- `_sandbox` 里的旧试验目录 hello-test、pnpm-check、hello-test2、hello-test3、hello-test4，可挪进回收目录。
- newapi-checkin 的 `.secret/key.txt`（51 字节，无代码引用）：若是在用令牌就存进密码管理器再挪走。
- 回收目录 `D:\Projects\_trash\`：用户自己清空。
- Gravity 根目录未入库的 `docs.zip`：用户说不用管。
- 想法（暂不做）：让 Gemini 直接跑 Windows 侧测试——runabout 刻意不开 Windows 互操作，需要时重新评估安全。

## 用户偏好速记（全文见 docs/09）
- 中文、简短、先结论；少停顿、少确认；小问题自己修、事后说。
- Windows 侧的事全写成 Codex 指令，别让用户粘 PowerShell。
- 删除：先出带编号的清单 → 用户勾选 → 挪回收目录 → 用户自己清空。
- 有用的信息当轮写进本仓库；更新时勘误、合并同类、删冗余，但不压缩失真（11-25）。
