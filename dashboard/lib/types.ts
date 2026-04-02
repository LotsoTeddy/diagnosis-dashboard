export interface Report {
  id: string
  instanceCreatedAt: string
  envVars: Record<string, string>
  clawConfig: Record<string, unknown>
  sessions: { name: string; messages: unknown[] }[]
  logs: { name: string; entries: unknown[] }[]
  createdAt: string
}
