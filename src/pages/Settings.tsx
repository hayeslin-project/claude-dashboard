import { useEffect, useState } from 'react';
import { Database, Info, Settings as SettingsIcon } from 'lucide-react';

function Settings() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats-cache.json')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <SettingsIcon size={28} />
          设置
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Claude Dashboard 配置
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* 数据源 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent-primary/20 rounded-lg">
              <Database size={20} className="text-accent-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">数据源</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border-color/50">
              <span className="text-text-secondary">数据目录</span>
              <span className="text-text-primary font-mono text-sm">~/.claude</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-color/50">
              <span className="text-text-secondary">总会话数</span>
              <span className="text-text-primary">{stats?.totalSessions || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-color/50">
              <span className="text-text-secondary">总消息数</span>
              <span className="text-text-primary">{stats?.totalMessages || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">统计最后更新</span>
              <span className="text-text-primary">{stats?.lastComputedDate || '-'}</span>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent-secondary/20 rounded-lg">
              <Info size={20} className="text-accent-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">关于</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border-color/50">
              <span className="text-text-secondary">应用名称</span>
              <span className="text-text-primary">Claude Dashboard</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-color/50">
              <span className="text-text-secondary">版本</span>
              <span className="text-text-primary">1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">技术栈</span>
              <span className="text-text-primary">React + Vite + Recharts</span>
            </div>
          </div>
        </div>

        <div className="card bg-accent-primary/5 border-accent-primary/30">
          <p className="text-text-secondary text-sm">
            Claude Dashboard 用于可视化展示 Claude Code 的使用数据，包括会话历史、工具调用、模型消耗等统计信息。
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
