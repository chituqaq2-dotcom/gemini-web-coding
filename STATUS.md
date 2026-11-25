# 现状与待办（接手时先看这里）

最后更新：2026-11-25 17:05（北京时间）。更早的逐条流水见 [docs/history/STATUS-2026-11-23至24-流水.md](docs/history/STATUS-2026-11-23至24-流水.md)，只在需要查细节时看。

## 一句话现状
整套流程可正常使用：用户在 Gemini 网页（Neon）里 @runabout 写代码、跑测试；Windows/WSL 侧的改动交本地 agent（Codex）；Hark 写指令、判结果、读额度、记账、维护本仓库。11-25 用真实项目 Crescendo-Bid（私有）跑通了“大项目修多处问题”的完整玩法（AGENTS.md §3）：诊断 → 4 个修复各开新对话、先调研后落代码 → 分支 `fix/section7-breaks` 本地 6 个提交（47bd02b、548f6ee、8f1f49e、1671db4、aa9e2e4、c48e818），每个修复相关测试都在容器里跑通，打分 80–92（docs/08）。现在等 Codex 在 Windows 构建前端、补跑测试、启动，然后用户点界面验收。同日还验证了：中文提示词可行（已改为默认）、两个 Gemini 对话可并发做不同项目、Gemini 能独立选型并改造一个油猴脚本（对话导出）。

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
- **额度读数**：油猴脚本把 usage 页读数推到只读接口 `/latest`（地址和密钥不在本仓库），Hark 任务后自己读（规则见 docs/09 末节），Hark Home 有额度面板（每分钟读同一个只读接口，不登录 Google）。链路搭法和修法见 docs/06“额度读数链路”。
- **自动点 Allow 脚本** userscripts/gemini-auto-allow.user.js 1.1.1（Tampermonkey，按 @updateURL 自动更新）：只点 runabout 卡片的 Always allow。1.0 实测没点；1.1.x 尚未在真实权限卡上验证。失败时请用户贴控制台 `[auto-allow]` 开头的日志。每次点击算一轮额度。

## 待办（按优先级）
1. **Crescendo-Bid 收尾**（11-25 16:28 已发 Codex 指令；17:01 用户说**已跑完**，结果在用户手里、还没交给 Hark——接手后先向用户要 Codex 的汇报）：Windows 上 `npm --prefix apps/crescendo run build`（含类型检查）+ 用项目 Windows 虚拟环境（Py3.14）分批跑相关测试 + 启动桌面端。结果回来后：用户点界面验收（A 待填空“写入当前稿”按钮；B PDF 招标补传 Word 入口与不一致 409 弹窗；C 技术部分“保存到本项目”与状态标签；D 投标前检查的“分册 / 压缩”按钮和“AI 对照最新稿查漏”区块）。有类型错误或失败就开新 Gemini 对话修。验收过后：开新对话一次性更新项目自己的文档（status、next、功能文档、链接检查，思考 medium），再由用户决定合并与推送。诊断报告在 `_sandbox/crescendo-diagnosis.md`（第 7 节断点，第 8–11 节各修复）。
2. **对话导出脚本**（11-25 Gemini 完成，基于开源 dikelps/gemini-conversation-exporter MIT 小改，`_sandbox/gemini-export`，本地提交 b4b5727，6 项单测过）：11-25 小改后（9f4beb2，0.1.8-local.2，9 项单测过）用户实测修复 C、D 两个长对话：轮次与“继续”一一对应，“始终允许”轮已合并、占位链接已清干净。发已备好的 Codex 指令，把它和 `gemini-quota`（额度脚本+Worker，先提交未提交的修复，基线 5282a0f 之后）挪到 `D:\Projects\scripts\tampermonkey\` 下各一个子目录（用户定的结构：scripts 下按类型分）。注意：导出里“始终允许”点击会作为单独的用户轮出现。
3. **runabout 记录每次工具调用 + 修 `read_files` 多路径只回最后一个文件**：一起交 Codex，要重建重启，先问用户。Gemini 单轮上限 10–36 次不等，有了日志才好查。
4. runabout 本地未推送提交（27cc420、3ed1fd2、509a978、9aeee08）：问用户是否推送（容器无凭据，需 Codex 或用户推）。
5. 自动点 Allow 1.1.1 在真实权限卡上验证。
6. 试验场可试：Task 模式长任务能否跑更久。
7. Gravity 6 个仅容器失败的测试（blobRefHook.contract、contextUpstream、gravityBackup、homeAutonomyHook、upstreamFormat、wardrobePickerUI，清单在 runabout deploy/WORKSPACE.md）：未查；试验阶段别把 Gravity 拉进来。
8. Gravity 手机 APK：下次打包时带上天气修复（网页已上线，11-23 验收）。
9. 未定：`.evaluation` 46GB（Crescendo 的评测数据）保留/归档/不动。

## 等用户自己处理（不用催）
- 额度脚本源码在用户电脑（不在 GitHub），11-25 Codex 修好新旧判断并部署（1.3.1 可选）；修复待提交。
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
