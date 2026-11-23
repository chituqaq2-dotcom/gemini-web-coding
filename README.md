# 用 Gemini 网页额度写代码（Gemini Web + MCP）

> 让 gemini.google.com 网页版（AI Pro / Ultra 订阅额度）直接读写你电脑上的项目、跑命令、跑测试。
> 不走 API 计费，不逆向网页接口，用的是 Google 官方的 **Custom apps（自定义 MCP）** 功能。

这份仓库是一份实战笔记：从零部署、踩过的坑、怎么给 Gemini 发指令，都按真实经历写成。会随着使用持续更新。

## 一句话原理

```
Gemini 网页 (Neon)  ──HTTPS──>  Cloudflare Tunnel  ──>  runabout (MCP 网关, Docker)  ──>  你的项目目录
```

[runabout](https://github.com/noir017/runabout) 把 shell、读文件、打补丁、搜代码这些工具通过 MCP 暴露出来；Cloudflare Tunnel 给它一个公网 HTTPS 地址，不用开端口；Gemini 网页在 Settings 里把这个地址加成 Custom app，之后对话里 `@runabout` 就能操作你的代码。

## 目录

| 文档 | 内容 |
|---|---|
| [01-可行性与风险](docs/01-可行性与风险.md) | 门槛（地区、账号、语言）、安全边界、什么不能做 |
| [02-本机部署（WSL2 + Docker）](docs/02-本机部署.md) | Windows 电脑上从零部署的完整步骤 |
| [03-接入 Gemini](docs/03-接入Gemini.md) | 在 Gemini 网页添加 Custom app、权限、首次测试 |
| [04-日常用法](docs/04-日常用法.md) | Chat 还是 Task、开场模板、控制上下文、额度 |
| [05-踩坑记录](docs/05-踩坑记录.md) | 每个真实遇到的问题和解法 |
| [06-维护](docs/06-维护.md) | 重启、看日志、更新 |
| [07-实战经验](docs/07-实战经验.md) | 我们自己用下来的结论和额度账，按日期追加 |
| [08-任务账本](docs/08-任务账本.md) | 每个任务的额度消耗和质量评分 |
| [prompts/](prompts/) | 可直接复制的提示词（部署用、日常用、项目任务用） |

## 最重要的 6 条

1. **用 Chat 模式**写代码（实测 Chat 能调 MCP，且只有 Chat 能调思考强度），分析用 medium、改代码用 high，边看边纠偏；Task 只给“交代清楚、让它一口气跑完”的长任务，中途别停（缓存只活 2–5 分钟，停顿超过 2 分钟每步消耗会涨好几倍）。
2. **提示词里带 `@runabout`**，强制它调工具，不然它可能自己瞎答。
3. **用英文下指令，结尾加 `Reply in Chinese.`**。官方只保证英文能可靠调用自定义应用。
4. **一个功能一个新对话**。对话越长越降智；用项目里的交接文件（`NOTES.md` 或现成的 AGENTS.md / docs）续接。
5. **先只读分析、再动手**。危险操作写明 `READ-ONLY` / `Do not delete anything`，看完报告自己决定。
6. **所有项目用 git，常推远端**。工具全开 Always allow 时，git 就是你的后悔药。

## 给 AI 助手

把这个仓库交给任何 AI，让它先读 [AGENTS.md](AGENTS.md)（项目约定），它就知道怎么帮你写提示词、怎么记账、怎么维护仓库。

## 免责

- 这等于把一台机器的 shell 放到公网上（有登录保护）。请只挂载项目目录、不放密钥，自行承担风险。
- 不要把网页版逆向成 API（web2api）给别的 agent 用，那违反 ToS，才是真正会封号的做法。

License: CC BY 4.0
