# 项目说明

## 前端 client

技术栈：

- vue3
- ts
- vite
- shadcn-vue：https://www.shadcn-vue.com/
- tailwindcss

如何运行：

```bash
cd ./packages/client
pnpm i
pnpm dev
```

项目运行在 `http://localhost:5173`

## 后端 server

技术栈：

- node
- typescript
- nest.js
- mysql
- typeorm
- jwt

如何运行：

> 需要提前准备好数据库
>
> 数据库名：`school_wall`，db文件在 `./packages/db` 下

```bash
cd ./packages/server
pnpm i
pnpm dev:server
```

服务启动在 `http://localhost:3000`

## 项目部署

前端采用 `Github Actions`，后端采用 `Vercel`
