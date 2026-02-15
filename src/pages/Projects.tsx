import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, MessageSquare, FileCode, ChevronRight } from 'lucide-react';
import { loadProjects } from '../utils/data';
import { Project } from '../types';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToSessions = (projectId: string) => {
    navigate(`/sessions?project=${encodeURIComponent(projectId)}`);
  };

  useEffect(() => {
    loadProjects().then((data) => {
      setProjects(data.sort((a, b) => b.sessions.length - a.sessions.length));
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

  const totalSessions = projects.reduce((sum, p) => sum + p.sessions.length, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">项目分析</h1>
        <p className="text-text-secondary text-sm mt-1">
          {projects.length} 个项目 · 共 {totalSessions} 个会话
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="card hover:border-accent-primary/50">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-accent-secondary/20 rounded-lg">
                <FolderOpen size={20} className="text-accent-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-text-primary font-medium truncate" title={project.name}>
                  {project.name}
                </h3>
                <p className="text-text-muted text-xs truncate">{project.path}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-color">
              <button
                onClick={() => goToSessions(project.id)}
                className="flex items-center gap-2 hover:text-accent-primary transition-colors"
              >
                <MessageSquare size={14} className="text-text-muted" />
                <span className="text-text-secondary text-sm">
                  {project.sessions.length} 会话
                </span>
                <ChevronRight size={14} className="text-text-muted" />
              </button>
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-text-muted" />
                <span className="text-text-secondary text-sm">
                  {project.sessions.length > 0 ? '活跃' : '暂无数据'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">项目统计摘要</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-bg-tertiary rounded-lg">
            <p className="text-text-secondary text-sm mb-1">总项目数</p>
            <p className="text-2xl font-bold text-text-primary">{projects.length}</p>
          </div>
          <div className="p-4 bg-bg-tertiary rounded-lg">
            <p className="text-text-secondary text-sm mb-1">总会话数</p>
            <p className="text-2xl font-bold text-text-primary">{totalSessions}</p>
          </div>
          <div className="p-4 bg-bg-tertiary rounded-lg">
            <p className="text-text-secondary text-sm mb-1">平均会话/项目</p>
            <p className="text-2xl font-bold text-text-primary">
              {projects.length > 0 ? (totalSessions / projects.length).toFixed(1) : 0}
            </p>
          </div>
          <div className="p-4 bg-bg-tertiary rounded-lg">
            <p className="text-text-secondary text-sm mb-1">最活跃项目</p>
            <p className="text-lg font-bold text-accent-primary truncate">
              {projects[0]?.name || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
