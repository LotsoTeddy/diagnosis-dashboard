import Link from "next/link";
import { storage } from "@/lib/storage";
import { FileText, Eye, Search } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const allReports = storage.getAll();

  // Filter reports by tracing ID if search query exists
  const reports = search
    ? allReports.filter((report) =>
        report.tracingId.toLowerCase().includes(search.toLowerCase())
      )
    : allReports;

  if (allReports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">暂无报告</h2>
        <p className="text-muted-foreground max-w-md">
          在 OpenClaw 实例中运行 <code className="bg-muted px-2 py-1 rounded font-mono text-sm">/arkclaw-diagnosis allow</code> 来创建诊断报告
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">诊断报告</h2>
          <p className="text-muted-foreground">
            {search ? `找到 ${reports.length} 条结果` : `共 ${reports.length} 条报告`}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar defaultValue={search} />

      {/* Results */}
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">未找到匹配的报告</h3>
          <p className="text-sm text-muted-foreground">
            没有找到追踪 ID 包含 "{search}" 的报告
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold">追踪 ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">报告时间</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">实例 ID</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report.tracingId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {report.tracingId}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(report.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {report.instanceInfo.instanceId}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/reports/${report.tracingId}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
