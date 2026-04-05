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

## Docker 一键启动（生产模式：前端 Nginx + 后端 + MySQL）

在项目根目录执行以下命令即可运行：

默认已设置服务构建/运行平台为 `linux/amd64`（更适合 mac 打包后在 Windows + mac 间通用）。
如果你是 Apple Silicon（M1/M2/M3）并希望使用原生 ARM 架构，可在根目录创建 `.env` 并配置：

```bash
TARGET_PLATFORM=linux/arm64
```

前端构建时会读取 `VITE_APP_API_BASE_URL`，默认是 `http://localhost:3000`。
如需覆盖，也可以在根目录 `.env` 配置：

```bash
VITE_APP_API_BASE_URL=http://localhost:3000
```

1. 先构建镜像

```bash
docker compose build
```

2. 再启动容器（后台运行）

```bash
docker compose up -d
```

3. 或者使用一条命令直接构建并启动（等价方式）

```bash
docker compose up -d --build
```

4. 查看容器状态

```bash
docker compose ps
```

5. 查看日志（可选）

```bash
docker compose logs -f
```

启动完成后访问：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:3000`
- MySQL：`localhost:3306`

停止并移除容器：

```bash
docker compose down
```

如果需要同时删除 MySQL 数据卷：

```bash
docker compose down -v
```
