import Link from "next/link"
import { getReports } from "@/lib/store"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const reports = getReports()

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">诊断报告</h1>
        <LogoutButton />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report ID</TableHead>
            <TableHead>实例创建时间</TableHead>
            <TableHead>上报时间</TableHead>
            <TableHead>会话数</TableHead>
            <TableHead>日志数</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono">{r.id}</TableCell>
              <TableCell>{r.instanceCreatedAt || "-"}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleString("zh-CN")}</TableCell>
              <TableCell>{r.sessions?.length ?? 0}</TableCell>
              <TableCell>{r.logs?.length ?? 0}</TableCell>
              <TableCell>
                <Link href={`/reports/${r.id}`}>
                  <Button variant="outline" size="sm">查看</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                暂无报告
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
