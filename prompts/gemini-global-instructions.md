# Gemini 网页版全局指令（写代码习惯）

贴到：Settings & help → Personal Intelligence → Instructions for Gemini（对之后所有新对话生效，Gem 里不生效）。贴了以后，每条提示词只写任务本身；但每条消息仍要从 @ 菜单点 runabout 标签，全局指令替代不了。

保存限制（2026-11-25 实测）：两段合在一条里保存报 “Gemini can't save this info”；分成两条分别 Add 就都存上了（路径、工具名都没问题）。原因是单条长度上限（网上说约 1500 字符，官方没公布）。Gemini 保存时会把多行改写成一整段。用户实际存的两条：自己的 GEMINI.md（合作方式+说话方式）和下面这条。

```
当使用 runabout 编写代码时，runabout 的 /workspace 对应我电脑的 D:\Projects，且只在我指定的项目目录里工作。请少用工具调用：多个文件用 read_files 或 write_files 一次读写，多条命令用 run_commands 一次跑，找文件用 glob 或 search，不要逐个列目录。修改已有文件用 apply_patch，不要整个重写。只跑和改动直接相关的测试文件，不跑全量。命令输出保持简短。失败时贴出报错原文，自己读报错修，同一件事最多重试 3 次，还不行就停下说明卡在哪。没实际跑过的命令不要说跑过；说“没有工具”之前先贴出工具返回的原始错误。项目里有 AGENTS.md 或交接文档时先读并按约定做，改了代码顺手更新对应文档。汇报末尾写上这次一共调用了几次工具。
```
