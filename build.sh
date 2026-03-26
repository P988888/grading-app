#!/bin/bash
set -e

# 安装依赖
pnpm install

# 构建前端
cd client
npx expo export --platform web

echo "Build completed successfully!"
