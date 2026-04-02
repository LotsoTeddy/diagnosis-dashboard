import { notFound } from "next/navigation"
import Link from "next/link"
import { getReport } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClawInfo } from "@/components/claw-info"

export const dynamic = "force-dynamic"

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const report = getReport(id)
  if (!report) notFound()

  const envVars = report.envVars || {}
  const envEntries = Object.entries(envVars)
  const instanceId = envVars["O11YAGENT_ATTR_CLAW_SERVICE_NAME"] || "-"
  const spaceId = envVars["O11YAGENT_ATTR_CLAW_SPACE_ID"] || "-"

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="outline">&larr; 返回</Button>
        </Link>
        <h1 className="text-2xl font-bold ">{report.id}</h1>
      </div>

      <Tabs defaultValue="instance">
        <TabsList>
          <TabsTrigger value="instance">实例信息</TabsTrigger>
          <TabsTrigger value="system">系统信息</TabsTrigger>
          <TabsTrigger value="claw">Claw 信息</TabsTrigger>
        </TabsList>

        {/* 实例信息 */}
        <TabsContent value="instance">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">实例 ID</p>
                  <p className="text-sm">{instanceId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Space ID</p>
                  <p className="text-sm">{spaceId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">实例创建时间</p>
                  <p className="text-sm">{report.instanceCreatedAt || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">上报时间</p>
                  <p className="text-sm">{new Date(report.createdAt).toLocaleString("zh-CN")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统信息：环境变量 + 历史命令 */}
        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>环境变量 ({envEntries.length})</CardTitle></CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>历史命令 ({(report.history || []).length})</CardTitle></CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-auto space-y-1">
                  {(report.history || []).map((cmd, i) => (
                    <div key={i} className="text-sm bg-muted px-3 py-1 rounded">
                      <span className="text-muted-foreground mr-2 inline-block w-8 text-right">{i + 1}</span>{cmd}
                    </div>
                  ))}
                  {(!report.history || report.history.length === 0) && (
                    <p className="text-muted-foreground">无历史命令</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Claw 信息：左侧竖向菜单 */}
        <TabsContent value="claw">
          <ClawInfo report={report} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
