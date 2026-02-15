export interface DailyActivity {
  date: string;
  messageCount: number;
  sessionCount: number;
  toolCallCount: number;
}

export interface DailyModelTokens {
  date: string;
  tokensByModel: Record<string, number>;
}

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
  contextWindow: number;
  maxOutputTokens: number;
}

export interface HourCounts {
  [hour: string]: number;
}

export interface LongestSession {
  sessionId: string;
  duration: number;
  messageCount: number;
  timestamp: string;
}

export interface StatsCache {
  version: number;
  lastComputedDate: string;
  dailyActivity: DailyActivity[];
  dailyModelTokens: DailyModelTokens[];
  modelUsage: Record<string, ModelUsage>;
  totalSessions: number;
  totalMessages: number;
  longestSession: LongestSession;
  firstSessionDate: string;
  hourCounts: HourCounts;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  sessions: ProjectSession[];
}

export interface ProjectSession {
  id: string;
  timestamp: string;
  messageCount: number;
}

export interface SessionMessage {
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  toolCalls?: string[];
}

export interface Session {
  id: string;
  projectId: string;
  timestamp: string;
  messages: SessionMessage[];
  messageCount: number;
  duration?: number;
}

export interface ToolUsage {
  name: string;
  count: number;
  lastUsed: string;
}

export interface ClaudeSettings {
  autoUpdatesChannel: string;
  env: Record<string, string>;
  language: string;
  minimumVersion: string;
  permissions: {
    defaultMode: string;
  };
}
