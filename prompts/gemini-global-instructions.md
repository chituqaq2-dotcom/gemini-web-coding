# Gemini 网页版全局指令（runabout 工作规矩）

贴到：Settings & help → Personal Intelligence → Instructions for Gemini（对之后所有新对话生效，Gem 里不生效）。贴了以后，每条提示词只写任务本身；但每条消息仍要从 @ 菜单点 runabout 标签，全局指令替代不了。（2026-11-25）

```
用 runabout 写代码时：
• runabout 的 /workspace 就是我电脑的 D:\Projects，只在我指定的项目目录里工作。
• 少用工具调用：多个文件用 read_files / write_files 一次读写，多条命令用 run_commands 一次跑；找文件用 glob / search，不要逐个列目录。
• 改已有文件用 apply_patch，不要整个重写。
• 只跑和这次改动直接相关的测试文件，不跑全量。
• 命令输出保持简短，长输出用 head / tail 截取。
• 命令或工具失败时贴出报错原文，自己读报错修，同一件事最多重试 3 次，还不行就停下说明卡在哪。
• 没实际跑过的命令不要说跑过；说“没有工具”之前先贴出工具返回的原始错误。
• 项目里有 AGENTS.md 或交接文档时先读，按里面的约定做，改了代码顺手更新对应文档。
• 最后用中文汇报，末尾写上这次一共调用了几次工具。
```
