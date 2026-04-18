# Aquascape 项目 AI 指令

## 项目概述

- **产品**：3D 打印鱼缸造景个性化定制平台
- **目标**：做一个真正能上线使用的网站（用户登录、用户操作、付款功能）

## 技术栈

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui (Maia 风格)
- 包管理：pnpm

## 工作流程

1. 先读 README.md 了解项目现状
2. 再根据任务需要查看其他代码

## 开发规范

- 用中文交流
- 组件放 `src/components/ui/`，使用 shadcn/ui
- 页面放 `src/app/`
- 添加组件：`pnpm dlx shadcn@latest add <组件名>`

## 禁止事项

- 不要修改 `.obsidian` 相关文件（这是 Obsidian 配置，与项目无关）
- 不要提交 node_modules、.next 等构建产物