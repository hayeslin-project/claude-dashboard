import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, FileCode, Zap, FolderOpen } from 'lucide-react';
import { loadStatsCache, calculateTotalTokens, formatNumber, formatDuration } from '../utils/data';
import { StatsCache } from '../types';
import StatCard from '../components/StatCard';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

function Dashboard() {
  const [stats, setStats] = useState<StatsCache | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatsCache().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-text-secondary">加载中...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-text-secondary">无法加载数据</div>
      </div>
    );
  }

  const totalTokens = calculateTotalTokens(stats.modelUsage);
  const totalSessions = stats.totalSessions;
  const totalMessages = stats.totalMessages;

  // Prepare chart data
  const activityData = stats.dailyActivity.map((day) => ({
    date: day.date.slice(5),
    messages: day.messageCount,
    sessions: day.sessionCount,
    tools: day.toolCallCount,
  }));

  // Model usage data
  const modelData = Object.entries(stats.modelUsage).map(([name, usage]) => ({
    name: name.replace('claude-haiku-4-5-20251001', 'claude-haiku').replace('z-ai/', ''),
    value: usage.inputTokens + usage.outputTokens,
  }));

  // Hour heatmap data
  const hourData = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString();
    return {
      hour: i,
      count: stats.hourCounts[hour] || 0,
    };
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">仪表盘</h1>
        <p className="text-text-secondary text-sm mt-1">
          统计时间: {stats.firstSessionDate?.slice(0, 10)} - {stats.lastComputedDate}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="总会话数"
          value={totalSessions}
          icon={MessageSquare}
          subtitle="共 38 个会话"
        />
        <StatCard
          title="总消息数"
          value={totalMessages}
          icon={FileCode}
          subtitle="交互消息总量"
        />
        <StatCard
          title="Token 消耗"
          value={formatNumber(totalTokens)}
          icon={Zap}
          subtitle="输入 + 输出 + 缓存"
        />
        <StatCard
          title="活跃项目"
          value={10}
          icon={FolderOpen}
          subtitle="已追踪项目数"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">每日活动趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed' }}
                  name="消息数"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4' }}
                  name="会话数"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Usage Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">模型使用分布</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {modelData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => formatNumber(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hour Heatmap */}
      <div className="card">
        <h2 className="text-lg font-semibold text-text-primary mb-4">活跃时间段分布 (24小时)</h2>
        <p className="text-text-muted text-sm mb-4">颜色越深表示该时段使用越频繁</p>
        <div className="flex flex-wrap gap-1">
          {hourData.map((item) => {
            const maxCount = Math.max(...hourData.map((d) => d.count), 1);
            const intensity = item.count / maxCount;
            const bgColor = item.count > 0
              ? `rgba(124, 58, 237, ${Math.max(0.2, intensity)})`
              : '#252525';
            
            return (
              <div
                key={item.hour}
                className="h-8 w-8 md:h-10 md:w-10 rounded text-xs flex flex-col items-center justify-center text-text-muted cursor-default"
                style={{ backgroundColor: bgColor }}
                title={`${item.hour}:00 - ${item.count} 次活跃`}
              >
                <span className="text-[10px] md:text-xs">{item.hour}</span>
                <span className="text-[8px] md:text-[10px]">{item.count}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
          <span>图例:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-bg-tertiary"></div>
            <span>无活动</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(124, 58, 237, 0.3)' }}></div>
            <span>低</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(124, 58, 237, 0.6)' }}></div>
            <span>中</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(124, 58, 237, 1)' }}></div>
            <span>高</span>
          </div>
        </div>
      </div>

      {/* Longest Session */}
      {stats.longestSession && (
        <div className="card mt-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">最长会话记录</h2>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-text-secondary text-sm">会话 ID</p>
              <p className="text-text-primary font-mono text-sm">{stats.longestSession.sessionId.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">持续时间</p>
              <p className="text-text-primary font-semibold">{formatDuration(stats.longestSession.duration)}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">消息数</p>
              <p className="text-text-primary font-semibold">{stats.longestSession.messageCount}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">日期</p>
              <p className="text-text-primary text-sm">{stats.longestSession.timestamp.slice(0, 10)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
