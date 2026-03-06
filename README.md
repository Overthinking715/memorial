<div align="center">

# 🕯️ 印记馆

**职场记忆的数字纪念堂 — 用赛博焚香，致敬每一段共事时光**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ 项目简介

**印记馆**是一款充满仪式感的 Web 应用，为每一位离开的同事建立一座数字纪念碑。

无论是离职的战友、转岗的搭档，还是曾并肩作战的项目伙伴 — 在这里，你可以为他们点一炷赛博心香，敬一杯虚拟咖啡，留一封数字书信。

### 核心功能

| 功能 | 说明 |
|:---:|:---|
| 🏛️ **祭台** | 为故交点燃赛博焚香，配有逼真的烟雾粒子动效 |
| 📝 **留言** | 书写仿古信笺风格的留言寄语，署名封缄 |
| 🌸 **供品** | 敬奉白菊、清茶、热咖等六种心意，温情指数实时升温 |
| 🗂️ **印记馆** | 浏览所有故交的纪念卡片，搜索和管理 |
| ➕ **建立印记** | 新增故交档案，支持头像上传 |
| ❤️ **互动点赞** | 为留言点赞，带弹跳粒子动效 |

## 🖼️ 设计理念

- **中式缅怀美学**：宣纸纹理、竖排书法、仿古印章、信笺格线
- **温暖而不沉重**：柔和的暖色调（`#F5F0E8`），配以橄榄绿与朱砂红点缀
- **微交互动效**：Framer Motion 驱动的烟雾、浮动、弹跳动画
- **移动优先**：专为手机端设计的沉浸式全屏体验

## 🛠️ 技术栈

| 层级 | 技术 |
|:---|:---|
| **前端框架** | React 19 + TypeScript |
| **构建工具** | Vite 6 |
| **样式方案** | TailwindCSS 4 |
| **动画引擎** | Motion (Framer Motion) |
| **路由** | React Router 7 |
| **后端 & 数据库** | Supabase (PostgreSQL + Storage) |
| **状态管理** | React Context + Hooks |

## 📁 项目结构

```
memorial/
├── src/
│   ├── components/         # 通用组件
│   │   ├── BottomNav.tsx       # 底部导航栏
│   │   ├── Layout.tsx          # 页面布局容器
│   │   ├── MessageModal.tsx    # 留言信笺模态框
│   │   └── OfferingModal.tsx   # 供品选择模态框
│   ├── context/
│   │   └── AppContext.tsx      # 全局状态管理（乐观更新）
│   ├── lib/
│   │   └── supabaseClient.ts   # Supabase 客户端初始化
│   ├── pages/              # 页面组件
│   │   ├── Altar.tsx           # 祭台（主页）
│   │   ├── Hub.tsx             # 印记馆（故交列表）
│   │   ├── Manage.tsx          # 故交管理
│   │   ├── AddMemorial.tsx     # 新增/编辑故交
│   │   └── MemorialDetail.tsx  # 故交详情页
│   ├── services/           # 后端服务层
│   │   ├── colleagueService.ts # 故交 CRUD
│   │   ├── messageService.ts   # 留言 CRUD
│   │   └── storageService.ts   # 图片上传
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase_schema.sql     # 数据库建表脚本
├── .env.example            # 环境变量模板
└── package.json
```

## 🚀 快速开始

### 前置要求

- **Node.js** ≥ 18
- 一个 [Supabase](https://supabase.com) 账号（免费套餐即可）

### 1. 克隆 & 安装

```bash
git clone <your-repo-url> memorial
cd memorial
npm install
```

### 2. 配置 Supabase

1. 前往 [supabase.com](https://supabase.com) 创建项目
2. 进入 **SQL Editor**，粘贴并执行 `supabase_schema.sql` 的内容
3. 进入 **Storage** → 创建名为 `photos` 的 **Public** bucket
4. 进入 **Settings → API**，拷贝 Project URL 和 anon key

### 3. 设置环境变量

在项目根目录创建 `.env.local`：

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon-key
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可体验。

## 📜 可用脚本

| 命令 | 说明 |
|:---|:---|
| `npm run dev` | 启动开发服务器（端口 3000） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | TypeScript 类型检查 |

## 🗄️ 数据库设计

```
colleagues (故交)         messages (留言)
┌──────────────────┐      ┌──────────────────┐
│ id (uuid, PK)    │◄─────│ colleague_id (FK)│
│ name             │      │ id (uuid, PK)    │
│ title            │      │ content          │
│ years            │      │ author           │
│ icon             │      │ is_pinned        │
│ photo_url        │      │ created_at       │
│ offerings[]      │      └──────────────────┘
│ incense_lit      │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
