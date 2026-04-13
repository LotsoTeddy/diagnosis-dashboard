"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { ReportSummary } from "@/lib/types"

export function ReportList({ reports }: { reports: ReportSummary[] }) {
  const [query, setQuery] = useState("")
  const filtered = query
    ? reports.filter((r) => r.id.includes(query))
    : reports

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="搜索 Report ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <span className="text-sm text-muted-foreground">
          共 {reports.length} 条报告{query && `，匹配 ${filtered.length} 条`}
        </span>
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
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.instanceCreatedAt || "-"}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleString("zh-CN")}</TableCell>
              <TableCell>{r.sessionCount}</TableCell>
              <TableCell>{r.logCount}</TableCell>
              <TableCell>
                <Link href={`/reports/${r.id}`}>
                  <Button variant="outline" size="sm">查看</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                {query ? "无匹配结果" : "暂无报告"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
