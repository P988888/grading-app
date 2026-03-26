# Vercel 部署指南

## 方式一：通过 GitHub 自动部署（推荐）

### 步骤 1：将代码推送到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
cd /workspace/projects
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 智能批改系统"

# 关联远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/您的仓库.git

# 推送
git push -u origin main
```

### 步骤 2：在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择您的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd client && npx expo export --platform web`
   - **Output Directory**: `client/dist`
6. 点击 "Deploy"

### 步骤 3：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
COZE_BUCKET_ENDPOINT_URL=您的对象存储端点
COZE_BUCKET_NAME=您的存储桶名称
```

---

## 方式二：使用 Vercel CLI 部署

### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2：登录 Vercel

```bash
vercel login
```

按照提示完成登录（支持 GitHub、GitLab、Email 等）

### 步骤 3：部署项目

```bash
cd /workspace/projects
vercel --prod
```

按照提示选择：
- Link to existing project? **No**
- Project name: **grading-app** (或您喜欢的名称)
- In which directory is your code located? **./**
- Want to override the settings? **No**

---

## 方式三：分离部署（推荐用于生产）

由于项目包含前后端，建议分离部署：

### 前端部署到 Vercel
- 静态文件托管
- 免费额度大
- CDN 加速

### 后端部署到 Railway/Render
- 支持 Express.js
- 支持 Node.js 环境
- 免费额度够用

**后端部署地址**：
- Railway: https://railway.app
- Render: https://render.com

---

## 部署成功后

您会得到一个访问链接，如：
- `https://grading-app.vercel.app`

### 在学习通中使用

1. **添加课程链接**
   - 进入学习通课程 → 添加模块
   - 选择"链接"类型
   - 填写您的应用 URL

2. **iframe 嵌入**（如果支持）
   ```html
   <iframe src="https://your-app.vercel.app" width="100%" height="800px"></iframe>
   ```

---

## 常见问题

### Q: 部署后 API 调用失败？
A: 检查环境变量是否正确配置，确保 COZE 相关配置已添加。

### Q: 页面空白？
A: 检查 `client/dist` 目录是否正确生成，重新运行 `npx expo export --platform web`。

### Q: 需要自定义域名？
A: 在 Vercel 项目设置中添加自定义域名，按提示配置 DNS。
