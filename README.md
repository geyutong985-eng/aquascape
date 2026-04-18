# Aquascape 鱼缸造景定制网站

> 3D 打印鱼缸造景个性化定制平台

## 项目状态

✅ **已初始化完成，组员可直接开发：**
- shadcn/ui 样式系统 + Tailwind CSS 4
- Button 组件已就绪
- `pnpm install` 后即可 `pnpm dev` 启动

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4（已通过 shadcn/ui 配置） |
| UI 组件库 | shadcn/ui (Maia 风格) |
| 包管理 | pnpm |

## 快速开始

```bash
# clone 后
pnpm install
pnpm dev
```

添加更多组件：`pnpm dlx shadcn@latest add card input form`

## Git 使用（重要！）

现在是测试阶段，可以直接在本分支开发调试。

如果需要把自己做的东西推送到 GitHub：
- **新建分支**：`git checkout -b feat/你的功能名`
- **不要直接 push 到 main/master 主分支**
- 合并前先提 PR 或让其他人 code review

## 项目结构

```
aquascape/
├── src/app/              # 页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式 + shadcn 主题
├── src/components/ui/    # shadcn/ui 组件
├── src/lib/utils.ts      # cn() 工具函数
├── components.json       # shadcn/ui 配置
└── package.json
```

## 相关链接

- [shadcn/ui](https://ui.shadcn.com)
- [Next.js](https://nextjs.org/docs)
- [Vercel](https://vercel.com)