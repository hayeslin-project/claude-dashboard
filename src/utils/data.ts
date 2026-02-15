import { StatsCache, Project, Session, ModelUsage } from '../types';

const API_BASE = '/api';

export async function loadStatsCache(): Promise<StatsCache | null> {
  try {
    const response = await fetch(`${API_BASE}/stats-cache.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function loadProjects(): Promise<Project[]> {
  try {
    const projectsDir = `${API_BASE}/projects`;
    const response = await fetch(`${projectsDir}/`);
    const text = await response.text();
    
    const projectFolders = text.match(/<a href="([^"]+)"/g) || [];
    const projects: Project[] = [];
    
    for (const match of projectFolders) {
      const href = match.match(/href="([^"]+)"/)?.[1];
      if (!href || href === '../' || !href.startsWith('-')) continue;
      
      const projectName = decodeURIComponent(href.replace(/^\//, '').replace(/-Users-hayeslin-workspace-/, '').replace(/-/g, '/'));
      const projectId = href;
      
      try {
        const sessionResponse = await fetch(`${projectsDir}/${href}`);
        const sessionText = await sessionResponse.text();
        const sessionFiles = sessionText.match(/href="[^"]*\.jsonl"/g) || [];
        
        const sessions: Session['id'][] = [];
        for (const sf of sessionFiles) {
          const sfMatch = sf.match(/href="([^"]+)"/);
          if (sfMatch) {
            sessions.push(sfMatch[1].replace('.jsonl', ''));
          }
        }
        
        projects.push({
          id: projectId,
          name: projectName,
          path: `~/${projectName}`,
          sessions: sessions.map(sid => ({
            id: sid,
            timestamp: '',
            messageCount: 0
          }))
        });
      } catch {
        // Skip projects we can't read
      }
    }
    
    return projects;
  } catch {
    return [];
  }
}

export async function loadSession(projectId: string, sessionId: string): Promise<Session | null> {
  try {
    const url = `${API_BASE}/projects/${projectId}/${sessionId}.jsonl`;
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const text = await response.text();
    const lines = text.trim().split('\n');
    
    const messages: Session['messages'] = [];
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        
        if (data.type === 'user' && data.message?.content) {
          const content = Array.isArray(data.message.content)
            ? data.message.content.map((c: any) => c.text || c.content || '').join('')
            : data.message.content;
          
          messages.push({
            type: 'user',
            content: content.replace(/<[^>]*>/g, ''),
            timestamp: data.timestamp,
            model: data.message?.model
          });
        } else if (data.type === 'assistant' && data.message?.content) {
          const content = Array.isArray(data.message.content)
            ? data.message.content.map((c: any) => c.text || c.thinking || '').join('')
            : data.message.content;
          
          messages.push({
            type: 'assistant',
            content: content.substring(0, 500),
            timestamp: data.timestamp,
            model: data.message?.model
          });
        }
      } catch {
        // Skip malformed lines
      }
    }
    
    return {
      id: sessionId,
      projectId,
      timestamp: messages[0]?.timestamp || '',
      messages,
      messageCount: messages.length
    };
  } catch {
    return null;
  }
}

export function calculateTotalTokens(modelUsage: Record<string, ModelUsage>): number {
  return Object.values(modelUsage).reduce((total, usage) => {
    return total + usage.inputTokens + usage.outputTokens + usage.cacheReadInputTokens;
  }, 0);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
