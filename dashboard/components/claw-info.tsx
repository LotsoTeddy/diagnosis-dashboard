"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const MENU = [
  { key: "config", label: "OpenClaw 配置", section: "config" },
  { key: "sessions", label: "会话历史", section: "sessions" },
  { key: "logs", label: "日志", section: "logs" },
] as const

function SectionSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
    </div>
  )
}

function LogEntry({ raw }: { raw: string }) {
  let color = "text-foreground"
  if (/"logLevelName"\s*:\s*"ERROR"/i.test(raw) || /"logLevelName"\s*:\s*"FATAL"/i.test(raw)) {
    color = "text-red-500"
  } else if (/"logLevelName"\s*:\s*"WARN"/i.test(raw) || /"logLevelName"\s*:\s*"WARNING"/i.test(raw)) {
    color = "text-yellow-600"
  }

  return (
    <pre className={cn("text-xs px-2 py-0.5 rounded whitespace-pre-wrap break-all", color)}>
      {raw}
    </pre>
  )
}

function useSectionData<T>(reportId: string, section: string, shouldFetch: boolean) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if (!shouldFetch || fetched) return
    setLoading(true)
    fetch(`/api/report/${reportId}/${section}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setFetched(true) })
      .catch(() => { setData(null); setFetched(true) })
      .finally(() => setLoading(false))
  }, [reportId, section, shouldFetch, fetched])

  return { data, loading }
}

export function ClawInfo({ reportId }: { reportId: string }) {
  const [active, setActive] = useState<string>("config")

  const { data: configData, loading: configLoading } = useSectionData<{ clawConfig: Record<string, unknown> }>(
    reportId, "config", active === "config"
  )
  const { data: sessionsData, loading: sessionsLoading } = useSectionData<{ sessions: { name: string; messages: unknown[] }[] }>(
    reportId, "sessions", active === "sessions"
  )
  const { data: logsData, loading: logsLoading } = useSectionData<{ logs: { name: string; entries: unknown[] }[] }>(
    reportId, "logs", active === "logs"
  )

  return (
    <div className="flex gap-4">
      <div className="w-40 shrink-0 space-y-1">
        {MENU.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              active === m.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        {active === "config" && (
          configLoading ? <SectionSpinner /> : (
            <Card>
              <CardHeader><CardTitle>OpenClaw 配置</CardTitle></CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px] text-sm ">
                  {JSON.stringify(configData?.clawConfig ?? {}, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )
        )}

        {active === "sessions" && (
          sessionsLoading ? <SectionSpinner /> : (
            <div className="space-y-4">
              {(sessionsData?.sessions || []).map((s) => (
                <Card key={s.name}>
                  <CardHeader><CardTitle className="text-base ">{s.name}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                      {s.messages.map((m, i) => (
                        <pre key={i} className="bg-muted p-2 rounded text-xs ">
                          {JSON.stringify(m, null, 2)}
                        </pre>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!sessionsData?.sessions || sessionsData.sessions.length === 0) && (
                <p className="text-muted-foreground">无会话数据</p>
              )}
            </div>
          )
        )}

        {active === "logs" && (
          logsLoading ? <SectionSpinner /> : (
            <div className="space-y-4">
              {(logsData?.logs || []).map((l) => (
                <Card key={l.name}>
                  <CardHeader><CardTitle className="text-base ">{l.name}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="max-h-[500px] overflow-auto space-y-0.5">
                      {l.entries.map((entry, i) => {
                        const raw = typeof entry === "string" ? entry : JSON.stringify(entry)
                        return <LogEntry key={i} raw={raw} />
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!logsData?.logs || logsData.logs.length === 0) && (
                <p className="text-muted-foreground">无日志数据</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
