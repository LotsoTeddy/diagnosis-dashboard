"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

function SectionSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
    </div>
  )
}

export function SystemTab({ reportId }: { reportId: string }) {
  const [envVars, setEnvVars] = useState<Record<string, string> | null>(null)
  const [history, setHistory] = useState<string[] | null>(null)
  const [envLoading, setEnvLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/report/${reportId}/env`)
      .then((r) => r.json())
      .then((d) => setEnvVars(d?.envVars ?? {}))
      .catch(() => setEnvVars({}))
      .finally(() => setEnvLoading(false))

    fetch(`/api/report/${reportId}/history`)
      .then((r) => r.json())
      .then((d) => setHistory(d?.history ?? []))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false))
  }, [reportId])

  const envEntries = envVars ? Object.entries(envVars) : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>环境变量{!envLoading && ` (${envEntries.length})`}</CardTitle></CardHeader>
        <CardContent>
          {envLoading ? <SectionSpinner /> : (
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Key</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {envEntries.map(([k, v]) => (
                    <TableRow key={k}>
                      <TableCell className="font-medium">{k}</TableCell>
                      <TableCell className="text-sm break-all max-w-[600px]">{v}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>历史命令{!historyLoading && ` (${history?.length ?? 0})`}</CardTitle></CardHeader>
        <CardContent>
          {historyLoading ? <SectionSpinner /> : (
            <div className="max-h-[400px] overflow-auto space-y-1">
              {(history || []).map((cmd, i) => (
                <div key={i} className="text-sm bg-muted px-3 py-1 rounded">
                  <span className="text-muted-foreground mr-2 inline-block w-8 text-right">{i + 1}</span>{cmd}
                </div>
              ))}
              {(!history || history.length === 0) && (
                <p className="text-muted-foreground">无历史命令</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
