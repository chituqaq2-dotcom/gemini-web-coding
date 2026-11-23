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
2. **Gravity 清理第三步**：已给本地 agent 一段指令，删除 6 个未追踪的跳过项（约 2.03G），保留 4 个受 Git 跟踪的素材目录。等用户回报结果，然后记账。
3. **额度读数共享**：已完成（2026-11-23 17:31）。油猴脚本 1.2.0 按标题分块解析，usage 页英文界面实测通过；只读接口已能读到读数（Hark 已接入并建了 Home 额度面板）。记账时先读接口，read_at 太旧就请用户刷新 usage 页。

4. **newapi-checkin 清理**（2026-11-23 20:15）：第一到四步完成，项目 15G→2.5G；回收目录 /workspace/_trash/newapi-checkin-20261123{,-step2,-step3,-step4}/ 等 2026-11-24 09:00 签到正常后清空。worktree 清理完成（20:27，本地 agent）：删 56 个已合并 worktree，prune 1 条，实释放约 1.03 GiB，51 个分支全留；剩 8 条因有未提交改动跳过（password-recovery-20261117 21 改+3 新、repeat-refresh-fix-20261117、verification-reminder-20261117、validation-attention-2、stability-stage-baseline-20261105、window-page-cpu-baseline-20261107、stability-late-credentials-20261107 内外两条），待用户决定提交或丢弃；明细 logs/wt-analysis.csv、logs/wt-remove-result.csv。.secret/ 和 logs/implement-lemon-geetest-20261018 不动。
6. **Gravity 功能修复开始**（2026-11-23 20:30）：bug1 天气只到城市级（深圳太大，宝安常报假雨）。已发 Gemini（新对话 Chat+high）：先诊断两个免费源，再支持填区名/手填坐标，守 docs/user-location.md 的隐私边界（只用手填，不读 GPS）。用户界面叫法全是中文，提示词里直接写界面原文即可。20:35 诊断：wttr.in 把 Shenzhen,Guangdong 解析到香港边马草垄报雨（假雨来源）；目标地点石岩（深圳宝安，22.686,113.941），同名石岩有 5 处、Shiyan 会落到十堰。提示词已更新为存坐标+省市校验。21:00 第一轮：读完代码出方案（质量好），撞单轮工具次数上限没改代码，约 8%。已同意有坐标时默认 Open-Meteo；第二轮同对话只改文件不碰 git，Windows 侧一段 PowerShell 跑测试+build:workers+建分支提交；自建 amsg Worker 需重新部署。
7. **待试：Gemini 侧 git fetch 测试**（用户 20:46 同意）：下次 Gemini 任务末尾加一句 `git fetch --dry-run`，看 WSL 里能否连 GitHub（21:00 Gemini 报告 runabout shell 外网 HTTP 被拦，大概率不行）；能的话以后推拉可以不经本地 agent。
5. **油猴脚本自动刷新**：已完成（2026-11-23 19:58 实测）。1.3.0：usage 页开着时每 5 分钟 reload 并上报，密钥缺失/无效时停。探查 RPC 方案放弃（要开 Chrome 远程调试，风险大）。read_at 即最后上报时间，用它判断读数新旧。

## 用户偏好速记
- 中文、简短、少停顿、少重复确认；小问题自己修，事后说。
- 删除必须先出清单、人确认；密码和 token 只由用户本人输入。
- 用户不在意花 Gemini 额度（2026-11-23 20:17）：能一步做完就别拆。只有 Gemini 碰不到的（Windows 侧 git 等）才交本地 agent。
