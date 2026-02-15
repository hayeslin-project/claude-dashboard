# Claude Dashboard

可视化展示 Claude Code 使用数据的仪表盘。

## 功能特性

- **仪表盘** - 总会话数、消息数、Token 消耗等核心统计
- **每日活动趋势** - 折线图展示活跃度变化
- **模型使用分布** - 饼图展示各模型使用占比
- **活跃时间段** - 24 小时热力图显示使用高峰
- **会话历史** - 按项目查看会话记录，支持消息详情
- **项目分析** - 各项目会话数量统计
- **工具使用** - 工具调用频率排行

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 http://localhost:5173

## 配置

默认读取 `~/.claude` 目录下的数据。如需修改，编辑 `vite.config.ts` 中的 `CLAUDE_DIR` 路径。

## 技术栈

- React 19
- Vite 7
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

## 截图

### 仪表盘

![Dashboard](./docs/dashboard.png)

### 会话历史

![Sessions](./docs/sessions.png)

### 项目分析

![Projects](./docs/projects.png)

### 工具使用

![Tools](./docs/tools.png)

## License

MIT
