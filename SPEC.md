# Claude Dashboard 规格文档

## 1. 项目概述

- **项目名称**: Claude Dashboard
- **项目类型**: Web 数据可视化仪表盘
- **核心功能**: 可视化展示 Claude Code 使用数据，包括会话历史、工具使用、模型消耗等
- **目标用户**: 使用 Claude Code 的开发者

## 2. UI/UX 规格

### 2.1 布局结构

- **导航栏**: 左侧固定侧边栏，宽度 240px
- **主内容区**: 右侧自适应内容区
- **页面结构**: 顶部页面标题 + 卡片式内容布局

### 2.2 响应式断点

- 桌面端: >= 1024px（侧边栏展开）
- 平板端: 768px - 1023px（侧边栏可折叠）
- 移动端: < 768px（侧边栏隐藏，汉堡菜单）

### 2.3 视觉设计

#### 颜色系统

```css
--bg-primary: #0f0f0f;        /* 主背景 */
--bg-secondary: #1a1a1a;      /* 卡片背景 */
--bg-tertiary: #252525;       /* 次级背景 */
--border-color: #333333;       /* 边框 */

--text-primary: #ffffff;      /* 主文字 */
--text-secondary: #a0a0a0;    /* 次级文字 */
--text-muted: #666666;        /* 弱化文字 */

--accent-primary: #7c3aed;    /* 主强调色 - 紫色 */
--accent-secondary: #06b6d4;  /* 次强调色 - 青色 */
--accent-success: #10b981;    /* 成功色 - 绿色 */
--accent-warning: #f59e0b;    /* 警告色 - 橙色 */
--accent-danger: #ef4444;     /* 危险色 - 红色 */

--gradient-start: #7c3aed;
--gradient-end: #06b6d4;
```

#### 字体

- **主字体**: "Inter", -apple-system, sans-serif
- **等宽字体**: "JetBrains Mono", monospace
- **标题**: 24px (h1), 20px (h2), 16px (h3)
- **正文**: 14px
- **小字**: 12px

#### 间距系统

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

#### 视觉效果

- 卡片圆角: 12px
- 按钮圆角: 8px
- 阴影: 0 4px 6px -1px rgba(0, 0, 0, 0.3)
- 过渡动画: 150ms ease-in-out
- 悬停效果: 背景色变亮 5%

### 2.4 组件列表

1. **Sidebar** - 侧边栏导航
2. **StatCard** - 统计卡片
3. **ChartCard** - 图表卡片
4. **ActivityChart** - 活动趋势图
5. **ModelUsageChart** - 模型使用饼图
6. **HourHeatmap** - 小时热力图
7. **SessionList** - 会话列表
8. **ProjectCard** - 项目卡片
9. **ToolUsageTable** - 工具使用表格
10. **SessionDetail** - 会话详情弹窗

## 3. 功能规格

### 3.1 仪表盘首页

- **总览统计**: 4个核心指标卡片
  - 总会话数
  - 总消息数
  - 总Token消耗
  - 活跃项目数
- **活动趋势图**: 折线图显示每日消息数、会话数、工具调用数
- **模型使用分布**: 饼图显示各模型使用占比
- **小时活跃热力图**: 7x24网格显示各小时活跃度

### 3.2 会话历史页面

- 项目选择器
- 会话列表（按时间倒序）
- 会话卡片：显示会话ID、时间、消息数、项目名
- 会话详情弹窗：完整消息流

### 3.3 工具分析页面

- 工具使用频率统计表
- 工具使用趋势图
- 最常用工具 Top 10

### 3.4 项目分析页面

- 项目列表（按会话数排序）
- 各项目统计数据
- 项目活跃时间线

## 4. 数据源

- `~/.claude/stats-cache.json` - 统计数据
- `~/.claude/projects/*/` - 项目会话数据
- `~/.claude/settings.json` - 设置数据

## 5. 验收标准

1. 页面加载时间 < 2秒
2. 正确显示所有统计数据
3. 图表交互流畅
4. 响应式布局正常
5. 无控制台错误
