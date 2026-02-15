import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, ChevronRight, Bot, User } from 'lucide-react';
import { loadProjects, loadSession, formatDate } from '../utils/data';
import { Project, Session } from '../types';

function generateMessageTitle(content: string, type: string): string {
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  if (!cleanContent) return type === 'user' ? '用户消息' : type === 'assistant' ? 'AI 回复' : '系统消息';
  
  const firstLine = cleanContent.split('\n')[0].slice(0, 50);
  if (firstLine.length < cleanContent.length) {
    return firstLine + '...';
  }
  return firstLine || (type === 'user' ? '用户消息' : type === 'assistant' ? 'AI 回复' : '系统消息');
}

function Sessions() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects().then((data) => {
      setProjects(data);
      const projectParam = searchParams.get('project');
      if (projectParam) {
        setSelectedProject(projectParam);
      } else if (data.length > 0) {
        setSelectedProject(data[0].id);
      }
      setLoading(false);
    });
  }, [searchParams]);

  useEffect(() => {
    if (!selectedProject) return;
    
    const project = projects.find((p) => p.id === selectedProject);
    if (!project) return;

    const loadAllSessions = async () => {
      const loadedSessions: Session[] = [];
      
      for (const sessionId of project.sessions.slice(0, 10)) {
        const session = await loadSession(selectedProject, sessionId.id);
        if (session) {
          loadedSessions.push(session);
        }
      }
      
      setSessions(loadedSessions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    };

    loadAllSessions();
  }, [selectedProject, projects]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-text-secondary">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">会话历史</h1>
        <p className="text-text-secondary text-sm mt-1">
          查看所有 Claude 会话记录
        </p>
      </div>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="text-text-secondary text-sm mb-2 block">选择项目</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-accent-primary"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sessions List */}
      <div className="grid gap-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="card cursor-pointer hover:border-accent-primary/50"
            onClick={() => setSelectedSession(session)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-primary/20 rounded-lg">
                  <MessageSquare size={18} className="text-accent-primary" />
                </div>
                <div>
                  <p className="text-text-primary font-mono text-sm">
                    {session.id.slice(0, 8)}...
                  </p>
                  <p className="text-text-muted text-xs">
                    {formatDate(session.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-text-secondary text-sm">
                <span>{session.messageCount} 条消息</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-secondary border border-border-color rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-border-color flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">会话详情</h2>
                <p className="text-text-muted text-sm font-mono">{selectedSession.id}</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {selectedSession.messages.slice(0, 50).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-accent-primary/10 ml-8'
                        : 'bg-bg-tertiary mr-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.type === 'user' ? (
                        <User size={12} className="text-accent-primary" />
                      ) : (
                        <Bot size={12} className="text-accent-secondary" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          msg.type === 'user'
                            ? 'text-accent-primary'
                            : 'text-accent-secondary'
                        }`}
                      >
                        {msg.type === 'user' ? '用户' : 'AI'}
                      </span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-text-primary text-xs font-medium truncate flex-1" title={generateMessageTitle(msg.content, msg.type)}>
                        {generateMessageTitle(msg.content, msg.type)}
                      </span>
                    </div>
                    <p className="text-text-primary text-sm line-clamp-3 ml-4">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sessions;
