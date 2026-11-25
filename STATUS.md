# 现状与待办（接手时先看这里）

最后更新：2026-11-25 11:55（北京时间）。更早的逐条流水见 [docs/history/STATUS-2026-11-23至24-流水.md](docs/history/STATUS-2026-11-23至24-流水.md)，只在需要查细节时看。

## 一句话现状
整套流程可正常使用：用户在 Gemini 网页（Neon）里 @runabout 写代码、跑测试；Windows/WSL 侧的改动交本地 agent（Codex）；Hark 写指令、判结果、读额度、记账、维护本仓库。当前主线：在 `_sandbox` 试验场里一步步验证 Gemini 能独立写代码和自测（六轮已过，见 docs/08），批量工具已上线并实测通过（第七版一轮 6 次调用），下一步用真实项目任务积累样本：第一个是用户的 Crescendo-Bid（投标文件工具，私有项目），11-25 Gemini 已做完只读诊断（2 轮共 36 次调用、10%），runabout 已放开，可直接改代码。Gemini 网页全局指令 11-25 已存，提示词只写任务。

## 已就绪
- **runabout**（用户 Windows 电脑，WSL2 Ubuntu-24.04 + Docker，源码 `~/runabout`，本地 main，未 push 到上游；重启会打断 Gemini 任务，先问用户）
  - 只挂载 D:\Projects → 容器内 `/workspace`；能出网（代理转发服务）；容器 git 设了 autocrlf=true、filemode=false（环境变量）。
  - 对 Gemini 暴露的工具（11-25 Codex 核对）：shell、shell_output、shell_kill、read、apply_patch、search、glob（write 代码里有但未注册）、write_files、read_files、run_commands（批量，11-25 上线）。
  - **权限（11-25 放开，runabout 本地提交 9aeee08）**：shell / run_commands 不再拦任何命令（rm、git push、python3 -c/-m、pip、node -e、复合命令、`$变量` 都行），只要求工作目录在 /workspace 内；write_files、apply_patch、read 等文件工具只认工作区内路径。项目登记不再限制读写执行，只用于挂载管理；pnpm 不再强制 `--ignore-scripts`。唯一硬边界：容器只挂 D:\Projects。开关是 policy.workspace_allowlist / workspace_shell_guard，默认关。容器里有 python3、python3-venv、pip 23.0.1；没有 GitHub 凭据（git push 要推送凭据才行，暂由 Codex 或用户推）。
  - 旧镜像备份 tag：runabout:backup-before-open-20261125（回滚用）。
  - Gravity 跑测试别跑全量（约 1467 个文件），只跑 `pnpm run test:run -- <文件>`；容器里 build:workers 会改动已跟踪的 worker/amsg/worker.bundle.js（路径注释），提交前还原。node_modules 是 Linux 格式，Windows 侧别用。
  - 隧道：cloudflared 钉版本 + `--protocol http2`（11-25 修偶发 URL_UNREACHABLE，runabout 本地提交，只重启了隧道容器）。观察是否复发。
  - smoke 前置：需要 /workspace/_sandbox/node-check 目录存在（11-25 重启时缺失导致 smoke 首次失败）。
  - 升级：按 runabout 的 deploy/WORKSPACE.md（fetch → rebase origin/main → 重建 → 跑 smoke）。注意：11-24 那次镜像是把新 Go 二进制换进现有镜像，暂不能从 Dockerfile 原样重建；下次正常 build 要确认 Node 层能下完。
- **额度读数**：油猴脚本把 usage 页读数推到只读接口 `/latest`（地址和密钥不在本仓库），Hark 任务后自己读（规则见 docs/09 末节），Hark Home 有每小时刷新的额度面板。
- **自动点 Allow 脚本** userscripts/gemini-auto-allow.user.js 1.1.1（Tampermonkey，按 @updateURL 自动更新）：只点 runabout 卡片的 Always allow。1.0 实测没点；1.1.x 尚未在真实权限卡上验证。失败时请用户贴控制台 `[auto-allow]` 开头的日志。每次点击算一轮额度。

## 待办（按优先级）
1. **Crescendo-Bid 行动 1**（用户私有项目，11-25 诊断完）：修 4 个真断点。权限已放开，Gemini 可直接改；等用户定路线后给提示词。
2. **runabout 记录每次工具调用**：11-25 发现 Gemini 单轮上限有时 13–15 次撞、有时 30 次不撞，runabout 标准输出不记调用，查不了。让 Codex 查数据卷有无调用记录，没有就加（时间、工具、条目数、输出字节）。
3. 自动点 Allow 1.1.1 在真实权限卡上验证。
4. 试验场下一步可试：Task 模式长任务能否跑更久。
5. **中文提示词实验**（11-25 用户提议）：下一个新对话改用中文写提示词，对比英文时的执行质量、调用次数、额度；没差别就以后都用中文（顺便解决回复语言）。
6. Gravity 6 个仅容器失败的测试（blobRefHook.contract、contextUpstream、gravityBackup、homeAutonomyHook、upstreamFormat、wardrobePickerUI，清单在 runabout deploy/WORKSPACE.md）：未查；用户说试验阶段别把 Gravity 拉进来。
7. Gravity 手机 APK：下次打包时带上天气修复（网页已上线，11-23 验收）。

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
