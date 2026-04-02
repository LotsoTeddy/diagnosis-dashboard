"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report } from "@/lib/types"
import { cn } from "@/lib/utils"

const LOG_LEVEL_COLORS: Record<string, string> = {
  FATAL: "text-red-600",
  ERROR: "text-red-500",
  WARN: "text-yellow-600",
  INFO: "text-blue-600",
  DEBUG: "text-gray-500",
  TRACE: "text-gray-400",
}

const MENU = [
  { key: "config", label: "OpenClaw 配置" },
  { key: "sessions", label: "会话历史" },
  { key: "logs", label: "日志" },
] as const

function LogEntry({ entry }: { entry: Record<string, unknown> }) {
  const meta = entry._meta as Record<string, unknown> | undefined
  const level = (meta?.logLevelName as string) || "INFO"
  const time = (entry.time as string) || ""
  const message = (entry["1"] as string) || JSON.stringify(entry)
  const color = LOG_LEVEL_COLORS[level] || "text-foreground"

  return (
    <div className={cn("text-xs px-2 py-0.5 rounded flex gap-2", color)}>
      {time && <span className="text-muted-foreground shrink-0">{time.replace(/T/, " ").replace(/\+.*/, "")}</span>}
      <span className={cn("shrink-0 font-bold w-12", color)}>{level}</span>
      <span className="break-all">{message}</span>
    </div>
  )
}

export function ClawInfo({ report }: { report: Report }) {
  const [active, setActive] = useState<string>("config")

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
          <Card>
            <CardHeader><CardTitle>OpenClaw 配置</CardTitle></CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px] text-sm ">
                {JSON.stringify(report.clawConfig, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {active === "sessions" && (
          <div className="space-y-4">
            {(report.sessions || []).map((s) => (
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
            {(!report.sessions || report.sessions.length === 0) && (
              <p className="text-muted-foreground">无会话数据</p>
            )}
          </div>
        )}

        {active === "logs" && (
          <div className="space-y-4">
            {(report.logs || []).map((l) => (
              <Card key={l.name}>
                <CardHeader><CardTitle className="text-base ">{l.name}</CardTitle></CardHeader>
                <CardContent>
                  <div className="max-h-[500px] overflow-auto space-y-0.5">
                    {l.entries.map((entry, i) => (
                      <LogEntry key={i} entry={entry as Record<string, unknown>} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!report.logs || report.logs.length === 0) && (
              <p className="text-muted-foreground">无日志数据</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
