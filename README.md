# Aquascape 鱼缸造景定制网站

> 3D 打印鱼缸造景个性化定制平台

## 项目简介

这是一个基于 Next.js 的现代 web 应用，用于提供 3D 打印鱼缸造景的个性化定制服务。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| UI 组件库 | shadcn/ui (基于 Radix Primitives) |
| 包管理 | pnpm |
| 部署平台 | Vercel |

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

### 添加 UI 组件

```bash
# 添加按钮
pnpm dlx shadcn@latest add button

# 添加卡片
pnpm dlx shadcn@latest add card

# 添加输入框
pnpm dlx shadcn@latest add input
```

## 项目结构

```
aquascape/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 首页
│   │   └── globals.css   # 全局样式
│   ├── components/
│   │   └── ui/           # shadcn/ui 组件
│   └── lib/
│       └── utils.ts      # 工具函数
├── public/               # 静态资源
├── components.json       # shadcn/ui 配置
├── next.config.ts        # Next.js 配置
├── tailwind.config.ts    # Tailwind 配置
└── package.json
```

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel 部署](https://vercel.com)

## License

MIT