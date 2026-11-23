# 部署提示词（发给本地 agent）

先把 `mcp.你的域名`、`<用户名>`、`<隧道名>` 换成自己的。前提：域名托管在你的 Cloudflare 账号，隧道和 DNS 已在 Zero Trust 里建好（Public hostname → `http://runabout:8484`）。全新电脑没有 WSL 的话，先看[踩坑 #1](../docs/05-踩坑记录.md)。

```
帮我在这台 Windows 11 电脑上用 WSL2 + Docker 部署 runabout（https://github.com/noir017/runabout），让 Gemini 网页版通过自定义 MCP 操作我的项目。每一步先说要执行什么。缺组件、参数不支持、网络要换镜像这类小问题，你直接用最小的办法修好继续，事后告诉我做了什么。只有这几种情况必须停下来问我：需要重启电脑、输密码、填隧道 token、会删或覆盖我已有的文件或数据、或者要挂载项目目录以外的路径。需要 root 的命令一律从 PowerShell 用 wsl -d Ubuntu-24.04 -u root -- <命令> 执行，不要用 sudo，也不要问我 Linux 密码。

已知信息：
• 公网域名：mcp.你的域名（Cloudflare 隧道 <隧道名> 和 DNS 已经配好，隧道把这个域名转发到 http://runabout:8484）
• 登录用户名：<用户名>
• 登录密码：由我在终端里自己输入（至少 8 位），你不要问、不要记录
• 项目目录：D:\Projects（WSL 里是 /mnt/d/Projects），只把它挂进容器
• 电脑：i5-13400 / 32GB，C 盘空间紧，WSL 放 E 盘

第一步：Windows 侧（管理员 PowerShell）
1. wsl --update
2. 新建目录 E:\WSL\runabout，把 Ubuntu-24.04 装到这里：wsl --install Ubuntu-24.04 --location E:\WSL\runabout。如果不支持 --location，就先正常安装，再用 wsl --manage Ubuntu-24.04 --move E:\WSL\runabout 移过去；还不支持的话，用 wsl --export 和 wsl --import 搬到 E 盘。
3. 写 %UserProfile%\.wslconfig：
[wsl2]
memory=8GB
processors=4
vmIdleTimeout=-1
networkingMode=mirrored
然后 wsl --shutdown。

第二步：WSL 内
1. /etc/wsl.conf 加上 [boot] systemd=true，重启 WSL 后确认 systemctl 可用。
2. 在 WSL 里直接装 Docker Engine（不要装 Docker Desktop），把当前用户加入 docker 组，并设为开机自启。网络不通就用国内镜像源。
3. git clone https://github.com/noir017/runabout ~/runabout，放在 WSL 自己的文件系统里，不要放 /mnt 下。

第三步：配置（都在 ~/runabout/deploy 下）
1. cp .env.example .env，改这几项：
RB_BASE_URL=https://mcp.你的域名（末尾不要斜杠）
AGENT_UID 和 AGENT_GID 填 id -u 和 id -g 的输出（一般是 1000）
SUDO_NOPASSWD=false
MEM_LIMIT=4g
CF_TUNNEL_TOKEN 先空着，第四步由我自己填
2. 新建 docker-compose.override.yml，不要改原来的 docker-compose.yml：
   • mcp 服务的 /workspace 挂载改成 /mnt/d/Projects:/workspace（除了它和 config.yaml、mcp-data，不挂任何别的路径）
   • 把原 compose 里注释掉的 cloudflared 服务加进来，用 .env 里的 CF_TUNNEL_TOKEN，网络用 ingress
   • 因为 SUDO_NOPASSWD=false，给 mcp 加上 security_opt: no-new-privileges:true
3. docker network create cloudflared
4. cp ../configs/config.example.yaml config.yaml，改这些：
server.listen: "0.0.0.0:8484"
server.base_url: "https://mcp.你的域名"
server.allowed_origins 里加上 "https://gemini.google.com"
auth.users 只保留一个用户，username: "<用户名>"
password_hash：先构建镜像（docker compose build），再用 docker compose run --rm --no-deps mcp hash-password 生成。运行这条命令时停下来，让我自己在终端里输两遍密码，你只把输出的那串 bcrypt 哈希（$2a$ 开头）填进 password_hash，不要把明文密码写进任何文件、命令参数或日志
auth.allow_unauthenticated_initialize: true（Gemini 必须开）
tools.shell.default_workdir: "/workspace"
其余保持默认，audit 保持开启。

第四步：填隧道 token 并启动
1. 停下来让我去 Cloudflare Zero Trust 控制台 → Networks → Tunnels → <隧道名> → Configure，把安装命令里 --token 后面那串复制到 .env 的 CF_TUNNEL_TOKEN。我说好了你再继续，不要读取或打印这个 token。
2. docker compose up -d --build

第五步：验证
1. docker compose ps 两个容器都是 healthy 或 running，Cloudflare 里 <隧道名> 变成 Healthy
2. curl -s https://mcp.你的域名/healthz
3. 跑 ~/runabout/skills/runabout-deploy/smoke.sh https://mcp.你的域名
4. 进容器确认 ls /workspace 能看到我的项目，且 ls /mnt 没有 Windows 盘，并且能在 /workspace 里新建、删除一个测试文件

第六步：开机保活
在 Windows 任务计划程序里加一个登录时触发的任务，隐藏运行 wsl.exe -d Ubuntu-24.04 -- sleep infinity，让 WSL 和容器一直在线。

全部完成后告诉我：MCP 地址（https://mcp.你的域名/mcp）、每一步的验证结果，以及以后重启、更新、查日志各用什么命令。
```
