# 智能批改系统 - 公网部署指南

## 问题说明

扣子(Coze)平台一键部署的应用**默认是私有的**，需要登录扣子账号才能访问。如果您需要一个可以直接发给学生使用的公开链接，请按照以下方式部署。

---

## 方案一：Vercel 一键部署（推荐）

### 步骤 1：登录 Vercel

在终端执行：
```bash
cd /workspace/projects
vercel login
```

选择 GitHub 登录（推荐）或 Email 登录。

### 步骤 2：部署到生产环境

```bash
vercel --prod
```

按提示选择：
- **Link to existing project?** No
- **Project name:** grading-app（或您喜欢的名称）
- **In which directory is your code located?** ./

### 步骤 3：配置环境变量

部署完成后，在 Vercel 网站上配置环境变量：

1. 进入项目 → Settings → Environment Variables
2. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `EXPO_PUBLIC_BACKEND_BASE_URL` | 您的 Vercel 域名 | 如 `https://grading-app.vercel.app` |

### 步骤 4：获取公开链接

部署成功后，您会得到一个类似这样的链接：
```
https://grading-app.vercel.app
```

**这个链接可以直接发给学生使用，无需登录。**

---

## 方案二：GitHub + Vercel 网页部署

### 步骤 1：推送代码到 GitHub

```bash
# 在 GitHub 创建新仓库后执行
cd /workspace/projects
git add .
git commit -m "feat: 智能批改系统"
git remote add origin https://github.com/您的用户名/您的仓库.git
git push -u origin main
```

### 步骤 2：在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **Add New Project**
4. 选择您的 GitHub 仓库
5. 点击 **Deploy**

Vercel 会自动检测配置并部署。

---

## 方案三：分离部署（更稳定）

如果您遇到问题，可以将前后端分离部署：

### 前端部署到 Vercel

1. 在 Vercel 创建新项目
2. Root Directory 设置为 `client`
3. Build Command: `npx expo export --platform web`
4. Output Directory: `dist`

### 后端部署到 Railway

1. 访问 [railway.app](https://railway.app)
2. 使用 GitHub 登录
3. 创建新项目 → 从 GitHub 仓库部署
4. Root Directory 设置为 `server`
5. 配置环境变量

---

## 部署完成后

### 在学习通中使用

1. **添加课程链接**
   - 进入学习通课程 → 添加模块
   - 选择"链接"类型
   - 填写您的应用 URL（如 `https://grading-app.vercel.app`）

2. **通过 iframe 嵌入**（如果学习通支持）
   ```html
   <iframe src="https://your-app.vercel.app" width="100%" height="800px"></iframe>
   ```

---

## 常见问题

### Q: Vercel 部署后 API 调用失败？
A: 检查 `EXPO_PUBLIC_BACKEND_BASE_URL` 环境变量是否正确设置为您的 Vercel 域名。

### Q: 页面空白？
A: 检查 Vercel 构建日志，确保前端构建成功。

### Q: 需要自定义域名？
A: 在 Vercel 项目设置中添加自定义域名，按提示配置 DNS CNAME 记录指向 `cname.vercel-dns.com`。

---

## 技术支持

如有问题，请检查 Vercel 的部署日志：
1. 进入项目 → Deployments
2. 点击最新的部署
3. 查看 Building 和 Functions 日志
