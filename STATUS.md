# 现状与待办（接手时先看这里）

最后更新：2026-11-23 20:20（北京时间）

**结论（2026-11-23 20:20）：整套流程评估完毕，可以正常使用。** 以后按“一个目标一段完整指令”来，不再一小步一小步试；只有删除前的清单确认和真出问题时才停下来问。

## 已就绪
- runabout 在用户 Windows 电脑上运行（WSL2 Ubuntu + Docker），只挂载项目盘；通过隧道接入 Gemini，自定义应用名 `runabout`（提示词里写 `@runabout`），7 个工具。
- 保活：Windows 计划任务常驻。维护命令见 docs/06。
- 本地补丁：`internal/tools/shell.go` 第 91 行 `OpenWorldHint` 改成了 false（未提交的本地改动）。升级 runabout 用 `git stash && git pull --ff-only && git stash pop` 再重建。原因见 docs/05 第 24 条。

## 额度基线（2026-11-23）
- 5 小时窗口：分析类（high）约 19%；执行类（medium）约 5%；小型只读复核约 6%。周额度很宽（一天做了 5 个任务才 2%）。
- 详细账本：docs/08。

## 挂着的事
1. **shell 权限弹窗**：已定论，不再折腾。设置页的 shell 在重连后会被 Gemini 打回 Always ask，与工具标记无关（见 docs/05 第 24 条）。对策：提示词要求把逐项操作写成一个脚本一次跑完。
2. **Gravity 清理第三步：已关闭**（21:23 本地 agent 复核）。6 个未跟踪项（约 2.03G）当天早些时候已删过（见 Gravity 的 docs/gravity/清理候选.md），重发的指令全部跳过、没误删；4 个受跟踪素材目录保留；D 盘可用 81.13 GiB。剩一个未入库的 docs.zip（9.8MB，20:24 生成）待用户决定。教训：重发清理指令前先查清理记录。
3. **额度读数共享**：已完成（2026-11-23 17:31）。油猴脚本 1.2.0 按标题分块解析，usage 页英文界面实测通过；只读接口已能读到读数（Hark 已接入并建了 Home 额度面板）。记账时先读接口，read_at 太旧就请用户刷新 usage 页。

4. **newapi-checkin 清理**（2026-11-23 20:15）：第一到四步完成，项目 15G→2.5G；回收目录已由用户自己清空（2026-11-23 21:09 前）。worktree 清理完成（20:27，本地 agent）：删 56 个已合并 worktree，prune 1 条，实释放约 1.03 GiB，51 个分支全留；剩 8 条因有未提交改动跳过（password-recovery-20261117 21 改+3 新、repeat-refresh-fix-20261117、verification-reminder-20261117、validation-attention-2、stability-stage-baseline-20261105、window-page-cpu-baseline-20261107、stability-late-credentials-20261107 内外两条），待用户决定提交或丢弃；明细 logs/wt-analysis.csv、logs/wt-remove-result.csv。.secret/ 和 logs/implement-lemon-geetest-20261018 不动。
6. **Gravity 功能修复开始**（2026-11-23 20:30）：bug1 天气只到城市级（深圳太大，宝安常报假雨）。已发 Gemini（新对话 Chat+high）：先诊断两个免费源，再支持填区名/手填坐标，守 docs/user-location.md 的隐私边界（只用手填，不读 GPS）。用户界面叫法全是中文，提示词里直接写界面原文即可。20:35 诊断：wttr.in 把 Shenzhen,Guangdong 解析到香港边马草垄报雨（假雨来源）；目标地点石岩（深圳宝安，22.686,113.941），同名石岩有 5 处、Shiyan 会落到十堰。提示词已更新为存坐标+省市校验。21:00 第一轮：读完代码出方案（质量好），撞单轮工具次数上限没改代码，约 8%。已同意有坐标时默认 Open-Meteo；第二轮同对话只改文件不碰 git，Windows 侧一段 PowerShell 跑测试+build:workers+建分支提交；自建 amsg Worker 需重新部署。21:15 第二轮：改完 11 个文件（核心、Worker、日志脱敏、用户空间），又撞上限；剩设置页 UI、文档、测试、CRLF 核验，用户回“继续”。额度 13%。注意它给的 PowerShell 块 git add 列了可能没改的文件（如 css），一个路径不匹配整条 add 会失败，收尾时核对。待办：Gemini 第二轮报告回来后，提醒用户在同对话补发“Also update docs/gravity/当前状态.md (branch, what changed, what is uncommitted or untested, next steps).”；21:31 第三轮（同对话 Chat+high）完成：共 24 个文件（设置页候选点选、两份文档、7 个测试文件），CRLF 已核验，git add 列表已按实际改动重列，脚本在打包/测试失败时自动停。21:35 Windows 跑：build:workers 过，11 文件 126 测试过；2 个 jsdom 测试因 Node 不支持 require(esm) 没跑（docs/05），且 exit 关掉了窗口、分支未建。已给补测+提交脚本（NODE_OPTIONS 开关，& { } 包裹）。21:38 已提交：Gravity 分支 fix/weather-place 2679fd5b（25 文件）。21:40 两个 jsdom UI 测试用 Node 26 补跑通过（8 条），全部测试已过。21:57 Codex：13 文件 134 条全过无 Unhandled Error；bundle 与 HEAD 一致无新提交；amsg Worker 已用仓库部署脚本重部署成功（/config-check ok，版本 2026-11-23）。剩：用户在 App（网页/开发版加载本分支）设置里输「石岩, 深圳, 广东」实测；手机 APK 要下次打包才生效。22:00 首次实测：预览仍是 wttr 文字查询报「小雨 23°C」（实际阴 21°C 无雨），页面无「确认地点」按钮、源 2 仍标默认 → 疑似前端没加载新分支，22:02 Ctrl+F5 后仍无按钮（设置→实时感知→环境感知页）。Codex 查明：用户开的是线上 gravity@9e4145b，不含本分支；组件接线正确。Codex 补全页回归测试并提交 74a03a28（14 文件 135 条过），交接页 docs/gravity/当前状态.md 已由 Codex 更新；本机 127.0.0.1:5173 开发服务在跑。另：OpenWeatherMap Key 框有内容时免费源选项会被隐藏（来源不明，可能浏览器自动填充）。22:56 用户在本地页验收通过。**天气 bug1 功能完成**；23:23 Codex 合并进 gravity（c26c9494）并发布网页（构建 mwtery49-c26c949），Key 框加防自动填充、有 Key 也显示免费回落源、401 回落免费源（14 文件 136 条过）；23:40 用户线上验收通过。**已关闭**。APK 下次打包带上。下一步：runabout 外网指令（已发 Codex）。之后等用户、重部署 amsg Worker、App 里实测「石岩, 深圳, 广东」；第三轮额度待刷新 usage 后记。确认可用后再发交接页收尾指令。修外网（runabout 容器代理）要等天气任务完、Windows 测试跑完再做（重启会打断 Gemini）。
7. **待试：Gemini 侧 git fetch 测试**（用户 20:46 同意）：下次 Gemini 任务末尾加一句 `git fetch --dry-run`，看 WSL 里能否连 GitHub（21:00 Gemini 报告 runabout shell 外网 HTTP 被拦，大概率不行）；能的话以后推拉可以不经本地 agent。
5. **油猴脚本自动刷新**：已完成（2026-11-23 19:58 实测）。1.3.0：usage 页开着时每 5 分钟 reload 并上报，密钥缺失/无效时停。探查 RPC 方案放弃（要开 Chrome 远程调试，风险大）。read_at 即最后上报时间，用它判断读数新旧。

## 用户偏好速记
- 中文、简短、少停顿、少重复确认；小问题自己修，事后说。
- 删除必须先出清单、人确认；密码和 token 只由用户本人输入。
- 用户不在意花 Gemini 额度（2026-11-23 20:17）：能一步做完就别拆。只有 Gemini 碰不到的（Windows 侧 git 等）才交本地 agent。

## 想法待评估（2026-11-23 21:48 用户提）
- 让 Gemini 自己跑 Windows 侧的测试/打包，省掉人工中转。思路：给 runabout 加一个白名单包装（只允许在 Gravity 目录跑 build:workers、vitest、git status/diff/add/commit），经 WSL interop 调 powershell.exe。拦路：runabout 在容器里（无 interop、无外网）。比让 Gemini 调 Codex 更直接（Codex 还要联网和登录）。未验证。21:50 用户：范围放宽到 D:\Projects，连同 runabout 外网一起做；Codex 调查+实现指令已写好（重启 runabout 前停一次问用户），但**先别发**：等天气收尾（Codex 部署→用户 App 验→Gemini 交接页）后再发，届时提醒用户。白名单只防手滑，不是安全边界（pnpm 脚本本身能跑任意代码）。

## runabout 外网（2026-11-24 00:10 Codex 报告，未重启）
- 原因：WSL 有代理变量，runabout 容器/进程没有（Compose 只给构建配了代理）；Windows 代理只监听回环，容器连不上。源码和近期日志里没有 PERMISSION_DENIED，原报错是否出自 Gemini 端未证实。
- 修复：runabout 仓库分支 fix/wsl-proxy-workspace-20261123（43bc030，未 push）：独立代理转发服务 + 向容器注入代理变量；工作区限 D:\Projects（容器内 /workspace）；命令白名单（git 安全子命令、node 跑脚本、pnpm/npx 限定、curl、只读工具），无 PowerShell/cmd/WSL 互操作/Docker 接口。独立容器 11 项检查通过。
- 隐患：白名单没有 mkdir/cp/mv/sed/python 等，Gemini 原来批量写脚本的做法会被拒；镜像没装 pnpm。白名单只管直接命令，项目脚本仍能改删 D:\Projects 内文件。
- 09:07 建议用户：先确认没有 Gemini 任务在跑，让 Codex 补上常用文件命令再重启自测。
- 09:44 Codex：白名单补 mkdir/cp/mv/touch/diff/sed/awk/xargs/tee/basename/dirname/realpath/tar/unzip、python3（仅跑工作区脚本，拒 -c/-m）；sed 禁原地改、awk 禁 system 等。提交 c43f8a6、56b2a76（未 push）。正式 runabout 已重启（镜像 runabout:workspace-proxy，healthy），容器内 27 项自测全过。下一步：Gemini 端实测出网+文件命令。
- 注意：sed 不能原地改（-i 被拒），Gemini 改文件应走文件工具。
- 12:42 Codex：白名单引号误判修好、容器 git autocrlf 修好（15c60cc，未 push），重启后 29 项自测全过。下一步：Gemini 端实测（Neon/Chat/低/新对话）。
- 12:51 Gemini 端实测全过：curl 200、mkdir/touch/cp 成功、Gravity git status 只剩 清理候选.md、rm 被拒且提示清楚。**runabout 外网修复关闭**。遗留：runabout 分支 fix/wsl-proxy-workspace-20261123 未合并进 runabout 主线（升级时会丢）；/workspace/.runabout-check 测试目录待清；依赖仍只能 Windows 跑。
- 12:58 Codex：runabout 修复快进合并进本地 main（HEAD b581801，未 push），升级步骤改写在 deploy/WORKSPACE.md；正式镜像与代码一致，未重启，29 项自测再过。OpenWorldHint 补丁仍为未提交改动。.runabout-check 已挪到 D:\Projects\_trash\runabout-check-20261124（用户可自行清空）。

