# Firefly-SubConverter

![Vue](https://img.shields.io/badge/Vue-3.5.x-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)
![Node](https://img.shields.io/badge/Node-24.x-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

基于 [Vite](https://vite.dev/) + [Vue 3](https://vuejs.org/) 构建的订阅转换前端，配合 [subconverter](https://github.com/LM-Firefly/subconverter) 后端使用，支持 Clash(mihomo) / Surge / QuantumultX / Singbox / Loon 等多种客户端。

## 目录

- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [Docker 部署](#docker-部署)
- [Nginx 部署](#nginx-部署)
- [目录结构](#目录结构)
- [相关项目](#相关项目)
- [License](#license)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 + TypeScript |
| 构建 | Vite 8 + esbuild |
| UI | Element Plus 2.14 |
| HTTP | Axios |
| 路由 | Vue Router 5 |
| PWA | vite-plugin-pwa + Workbox |
| 自动导入 | unplugin-auto-import + unplugin-vue-components |

## 环境要求

- **Node.js**: >= 24.x
- **pnpm**: >= 9.x

## 快速开始

```bash
git clone https://github.com/LM-Firefly/sub-web.git
cd sub-web
pnpm install
pnpm dev
```

访问 <http://localhost:5173/>

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 本地预览构建产物 |

## 环境配置

在项目根目录创建 `.env` 文件，参考 [.env](.env) 或如下模板：

```env
# 项目链接
VITE_PROJECT=https://github.com/LM-Firefly/sub-web
VITE_BACKEND=https://github.com/LM-Firefly/Firefly-sub
VITE_BOT_LINK=https://t.me/subconverter_discuss
VITE_RULESET_LINK=https://github.com/LM-Firefly/Rules

# Subconverter 后端
VITE_SUBCONVERTER_DEFAULT_BACKEND=https://sub.koyeb.app
VITE_SUBCONVERTER_REMOTE_CONFIG=https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/MultiSub-NoReject.toml
VITE_SUBCONVERTER_DOC_ADVANCED=https://github.com/LM-Firefly/subconverter/blob/main/README-cn.md

# 页面配置
VITE_USE_STORAGE=true
VITE_CACHE_TTL=86400
```

## Docker 部署

```bash
docker build -t subweb .
docker run -d -p 58080:80 --restart always --name subweb subweb
```

Dockerfile 使用多阶段构建：Node 24 Alpine 编译 + Nginx 1.24 Alpine 托管静态文件。

## Nginx 部署

构建后将 `dist` 目录部署到 Nginx：

```bash
pnpm build
```

Nginx 参考配置：

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

如部署在子路径（如 `/sub-web/`），构建时指定 base：

```bash
pnpm build --base=/sub-web/
```

## 目录结构

```
src/
├── main.ts                  # 应用入口
├── App.vue                  # 根组件
├── views/
│   └── Subconverter.vue     # 主页面（订阅转换表单）
├── components/
│   ├── UrlParseDialog.vue   # URL 解析弹窗
│   ├── PrivacyNotice.vue    # 隐私声明
│   └── SvgIcon/             # SVG 图标组件
├── composables/
│   ├── useSubconverter.ts   # 订阅转换逻辑（表单状态、生成 URL、导入 Clash）
│   ├── useBackend.ts        # 后端版本检测
│   └── useOptions.ts        # 下拉选项聚合
├── config/
│   ├── client-types.ts      # 客户端类型列表（Clash / Surge / QuanX / ...）
│   ├── remote-configs.ts    # 远程配置列表
│   └── constants.ts         # 常量
├── services/
│   └── backendService.ts    # 后端 API 封装
├── utils/
│   ├── formatters.ts        # URL 参数格式化
│   ├── validators.ts        # 表单校验
│   ├── storage.ts           # localStorage 封装
│   ├── search.ts            # 搜索工具
│   └── index.ts             # 通用工具（clipboard 等）
├── plugins/                 # Vite 插件配置
├── router/                  # Vue Router
├── icons/svg/               # SVG 精灵图源文件
└── assets/css/              # 全局样式
```

## 相关项目

- [tindy2013/subconverter](https://github.com/tindy2013/subconverter) — 订阅转换后端
- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) — Clash.Meta 内核
- [LM-Firefly/Rules](https://github.com/LM-Firefly/Rules) — 规则集

## License

MIT
