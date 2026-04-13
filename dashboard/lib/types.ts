export interface Report {
  id: string
  instanceCreatedAt: string
  envVars: Record<string, string>
  clawConfig: Record<string, unknown>
  sessions: { name: string; messages: unknown[] }[]
  logs: { name: string; entries: unknown[] }[]
  history: string[]
  createdAt: string
}

export interface ReportSummary {
  id: string
  instanceCreatedAt: string
  createdAt: string
  sessionCount: number
  logCount: number
}

export type ReportSection = "env" | "config" | "sessions" | "logs" | "history"
