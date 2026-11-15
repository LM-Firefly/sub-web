# Firefly-SubConverter

![Vue](https://img.shields.io/badge/Vue-3.5.x-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)
![Node](https://img.shields.io/badge/Node-24.x-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

基于 [Vite 8](https://vite.dev/) + [Vue 3](https://vuejs.org/) 构建的订阅转换前端，配合 [subconverter](https://github.com/LM-Firefly/subconverter) 后端使用，支持 Clash(mihomo) / Surge / QuantumultX / Singbox / Loon 等多种客户端。

订阅链接的拼装完全在浏览器端完成，页面本身不存储任何订阅数据。

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [环境配置](#环境配置)
- [Docker 部署](#docker-部署)
- [Nginx 部署](#nginx-部署)
- [Cloudflare Pages 部署](#cloudflare-pages-部署)
- [目录结构](#目录结构)
- [参与开发](#参与开发)
- [相关项目](#相关项目)
- [License](#license)

## 功能特性

- 基础 / 进阶两种模式：进阶模式提供节点筛选、规则、输出文件名、UA、自定义参数等完整转换选项
- 多客户端目标：Clash / Surge(4/5/6) / Quantumult(X) / Singbox / Loon / Surfboard / Shadowsocks 系 / V2Ray / Trojan / 混合订阅 / 自动判断
- 远程配置：内置 LM-Firefly、ACL4SSR 等配置分组，也可手动粘贴任意配置地址
- 链接导入：粘贴已有定制订阅链接即可还原表单与自定义参数
- 三态选项（默认 / 开 / 关）：未指定的开关不会拼进链接，由后端默认值决定
- 一键复制定制订阅，一键拉起 Clash 安装
- 后端版本检测、源订阅本地缓存（TTL 可配）、PWA 离线缓存与自动更新

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5（Composition API，`<script setup lang="ts">`） |
| 构建 | Vite 8 |
| 语言 | TypeScript |
| UI | Element Plus 2（unplugin 自动按需引入） |
| HTTP | Axios |
| 路由 | Vue Router 5 |
| PWA | vite-plugin-pwa + Workbox |

## 环境要求

- **Node.js**: >= 24
- **pnpm**: 9+（`build.cmd` 与 CI 均使用 pnpm 10）

## 快速开始

```bash
git clone https://github.com/LM-Firefly/sub-web.git
cd sub-web
pnpm install
pnpm dev
```

访问 <http://localhost:5173/>。Windows 下也可直接运行 `build.cmd` 一键完成安装与构建。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本（输出 `dist/`） |
| `pnpm preview` | 本地预览构建产物 |

## 环境配置

构建期变量统一使用 `VITE_` 前缀，模板见 [.env](.env)。修改后需重新构建才生效：

| 变量 | 说明 |
|------|------|
| `VITE_SUBCONVERTER_DEFAULT_BACKEND` | 默认转换后端地址（页面会自动追加 `/sub?`） |
| `VITE_SUBCONVERTER_REMOTE_CONFIG` | 「远程配置示例」跳转链接 |
| `VITE_SUBCONVERTER_DOC_ADVANCED` | 进阶参数文档链接 |
| `VITE_PROJECT` | 页头 GitHub 图标跳转链接 |
| `VITE_BACKEND` | 后端项目仓库链接 |
| `VITE_RULESET_LINK` | 规则集仓库链接 |
| `VITE_BOT_LINK` | Telegram 图标跳转链接 |
| `VITE_USE_STORAGE` | 设为 `true` 时在本地记住源订阅地址 |
| `VITE_CACHE_TTL` | 本地缓存有效期（秒，默认 `3600`） |

> `.env` 中注释掉的 `VITE_MYURLS_API`、`VITE_CONFIG_UPLOAD_API` 为历史遗留项，当前版本不读取。

## Docker 部署

```bash
docker build -t subweb .
docker run -d -p 58080:80 --restart always --name subweb subweb
```

多阶段构建：Node 24 Alpine 编译 + Nginx 1.24 Alpine 托管静态文件。环境变量在构建期注入（构建前改好 `.env` 即可）；镜像内只包含前端，subconverter 后端需另行部署。

> 注意：Dockerfile 的构建阶段执行 `pnpm install --frozen-lockfile`，但仓库不提交 `pnpm-lock.yaml`（见 `.gitignore`），干净环境下 `docker build` 会因缺少锁文件失败。可先本地执行 `pnpm install` 生成锁文件，并把 `COPY package*.json ./` 改为同时拷贝 `pnpm-lock.yaml`，或去掉 `--frozen-lockfile`。

## Nginx 部署

构建后将 `dist/` 目录部署到 Nginx：

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/sub-web/dist;
    index index.html;

    error_page 404 /index.html;

    gzip on;
    gzip_min_length 1k;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/xml;

    location ~* \.(css|js|png|jpg|jpeg|gif|svg|mp4|ogg|webm|woff)$ {
        access_log off;
        add_header Cache-Control "public,max-age=30*24*3600";
    }
}
```

部署在子路径（如 `/sub-web/`）时通过 `VITE_BASE` 指定：

```bash
VITE_BASE=/sub-web/ pnpm build
```

## Cloudflare Pages 部署

推送到 `main` 分支后由 GitHub Actions 完成：

- `pages.yml` 以 `VITE_BASE=/sub-web/` 构建，将产物提交到 `docs/`，并替换 Cloudflare Web Analytics 的占位 token —— Cloudflare Pages 直接托管该目录（`public/_redirects` 提供 SPA 回退）
- `build.yml` 上传 `dist/` 构建产物，并联动 [LM-Firefly/subconverter](https://github.com/LM-Firefly/subconverter) 仓库更新子模块

`docs/` 是 CI 生成并提交的构建产物，不要手工修改。

## 目录结构

```
├── index.html                    # 入口 HTML
├── vite.config.ts                # 构建配置（VITE_BASE、分包、@ 别名）
├── build.cmd                     # Windows 一键安装并构建
├── Dockerfile                    # 多阶段镜像（node:24-alpine → nginx:1.24-alpine）
├── .env                          # 构建期环境变量
├── CONTEXT.md                    # 领域词汇说明
├── src/
│   ├── main.ts                   # 应用入口
│   ├── App.vue                   # 根组件（Element Plus 中文语言包）
│   ├── registerServiceWorker.ts  # PWA 注册与更新提示
│   ├── views/
│   │   └── Subconverter.vue      # 主页面（唯一路由）
│   ├── components/
│   │   ├── PrivacyNotice.vue     # 隐私提示（自动消失）
│   │   ├── TriStateCheckbox.vue  # 三态选项控件
│   │   ├── UrlParseDialog.vue    # 链接导入弹窗
│   │   └── SvgIcon/index.vue     # 内联 SVG 图标组件
│   ├── composables/
│   │   ├── useSubconverter.ts    # 表单状态、生成链接、导入还原、安装
│   │   ├── useBackend.ts         # 后端版本检测
│   │   └── useOptions.ts         # 客户端 / 远程配置 / 后端下拉选项
│   ├── config/
│   │   ├── constants.ts          # 后端预设、Clash DNS 选项
│   │   ├── client-types.ts       # 客户端类型映射
│   │   └── remote-configs.ts     # 远程配置分组
│   ├── services/
│   │   └── backendService.ts     # 后端版本查询、配置地址解析
│   ├── utils/
│   │   ├── formatters.ts         # URL 参数拼装（TriState 定义）
│   │   ├── search.ts             # 订阅链接解析（导入还原）
│   │   ├── validators.ts         # 表单校验
│   │   ├── storage.ts            # TTL 本地存储
│   │   └── index.ts              # 剪贴板复制
│   ├── plugins/                  # 组件注册与 Vite 插件
│   ├── icons/svg/                # SVG 图标源文件
│   └── assets/css/               # 全局样式
├── public/
│   ├── favicons/                 # 站点图标与 manifest
│   ├── _redirects                # SPA 回退规则
│   └── robots.txt
└── docs/                         # CI 提交的构建产物（Cloudflare Pages 托管）
```

## 参与开发

工程约定见 [AGENTS.md](AGENTS.md)，领域词汇见 [CONTEXT.md](CONTEXT.md)。

## 相关项目

- [tindy2013/subconverter](https://github.com/tindy2013/subconverter) — 订阅转换后端
- [LM-Firefly/Firefly-sub](https://github.com/LM-Firefly/Firefly-sub) — 后端部署项目
- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) — Clash.Meta 内核
- [LM-Firefly/Rules](https://github.com/LM-Firefly/Rules) — 规则集

## License

MIT
