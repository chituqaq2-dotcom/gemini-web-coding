# 现状与待办（接手时先看这里）

最后更新：2026-11-23 14:25（北京时间）

## 已就绪
- runabout 在用户 Windows 电脑上运行（WSL2 Ubuntu + Docker），只挂载项目盘；通过隧道接入 Gemini，自定义应用名 `runabout`（提示词里写 `@runabout`），7 个工具。
- 保活：Windows 计划任务常驻。维护命令见 docs/06。
- 本地补丁：`internal/tools/shell.go` 第 91 行 `OpenWorldHint` 改成了 false（未提交的本地改动）。升级 runabout 用 `git stash && git pull --ff-only && git stash pop` 再重建。原因见 docs/05 第 24 条。

## 额度基线（2026-11-23）
- 5 小时窗口：分析类（high）约 19%；执行类（medium）约 5%；小型只读复核约 6%。周额度很宽（一天做了 5 个任务才 2%）。
- 详细账本：docs/08。

## 挂着的事
1. **shell 权限弹窗**：设置页不再被重置，但对话里点“始终允许”也无效，同一对话仍会再弹（2026-11-23 15:34 实测）。可再试 `DestructiveHint` 改 false，否则接受每次点。
2. **Gravity 清理第三步**：已给本地 agent 一段指令，删除 6 个未追踪的跳过项（约 2.03G），保留 4 个受 Git 跟踪的素材目录。等用户回报结果，然后记账。
3. **额度读数共享**（可选）：其他 agent 读不到 Gemini usage 页。现阶段请用户发一句读数；以后可做“浏览器油猴脚本 → 小接口”的自动上报（思路见 docs/07 最后一节）。

## 用户偏好速记
- 中文、简短、少停顿、少重复确认；小问题自己修，事后说。
- 删除必须先出清单、人确认；密码和 token 只由用户本人输入。
- 机械活交给本地 agent（agy / Codex），Gemini 额度留给分析和写代码。
