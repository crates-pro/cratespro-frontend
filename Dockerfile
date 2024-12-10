FROM node:22.12.0-alpine3.19 AS builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build





# 使用轻量级的 Node.js 镜像
FROM node:22.12.0-alpine3.19 AS runner

# 设置工作目录
WORKDIR /app

# 复制构建好的文件
COPY --from=builder /app ./

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]