# 03 接入 Gemini 网页

## 添加 Custom app
1. gemini.google.com → 设置 → **Personal Intelligence** → Connected Apps → Custom apps → **+ Custom**。
   直达：`gemini.google.com/customize/connectors`
2. 地址填 `https://mcp.你的域名/mcp`。
3. **Client ID / Client secret 都留空**（runabout 支持动态注册 DCR），点 Next。
4. 跳到 runabout 登录页，输你的用户名和密码，允许。
5. 保存前**把名字改成英文短名，比如 `runabout`**（默认是“服务器基础工具集”这类中文名）。名字决定你在对话里怎么 `@` 它。忘了改就 Disconnect 后重加一次。
6. 工具权限：7 个工具。想省事就全部 Always allow（前提：项目都在 git 里）；谨慎点就只读类 Always allow，写入和 shell 保持 Always ask。

看不到 Custom 选项：多半是节点不在美国、界面不是英文、或 History 没开。

## 首次测试
新对话，模型选 Neon，发：

```
@runabout list the top-level folders in /workspace. Don't change anything.
```

能列出你项目目录里的文件夹就通了。

## Chat 与 Task 在哪
输入框附近有 Chat / Task 切换（安卓 App 在输入框上方）。两种都能调 `@runabout`。
