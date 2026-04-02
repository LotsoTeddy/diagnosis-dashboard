import { notFound } from "next/navigation"
import Link from "next/link"
import { getReport } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const report = getReport(id)
  if (!report) notFound()

  const envEntries = Object.entries(report.envVars || {})

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="outline">&larr; 返回</Button>
        </Link>
        <h1 className="text-2xl font-bold font-mono">{report.id}</h1>
        <Badge>{report.instanceCreatedAt || "未知创建时间"}</Badge>
      </div>

      <Tabs defaultValue="env">
        <TabsList>
          <TabsTrigger value="env">环境变量</TabsTrigger>
          <TabsTrigger value="config">Claw 配置</TabsTrigger>
          <TabsTrigger value="sessions">会话历史</TabsTrigger>
          <TabsTrigger value="logs">日志</TabsTrigger>
        </TabsList>

        <TabsContent value="env">
          <Card>
            <CardHeader>
              <CardTitle>环境变量 ({envEntries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-auto">
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
                        <TableCell className="font-mono font-medium">{k}</TableCell>
                        <TableCell className="font-mono text-sm break-all max-w-[600px]">{v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>OpenClaw 配置</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px] text-sm font-mono">
                {JSON.stringify(report.clawConfig, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="space-y-4">
            {(report.sessions || []).map((s) => (
              <Card key={s.name}>
                <CardHeader>
                  <CardTitle className="text-base font-mono">{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-auto">
                    {s.messages.map((m, i) => (
                      <pre key={i} className="bg-muted p-2 rounded text-xs font-mono">
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
        </TabsContent>

        <TabsContent value="logs">
          <div className="space-y-4">
            {(report.logs || []).map((l) => (
              <Card key={l.name}>
                <CardHeader>
                  <CardTitle className="text-base font-mono">{l.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-[400px] overflow-auto">
                    {l.entries.map((entry, i) => (
                      <pre key={i} className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {JSON.stringify(entry)}
                      </pre>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!report.logs || report.logs.length === 0) && (
              <p className="text-muted-foreground">无日志数据</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
