import Link from "next/link";
import { notFound } from "next/navigation";
import { storage } from "@/lib/storage";
import { ArrowLeft, Calendar, Server, Package, Terminal, FileText, Info } from "lucide-react";
import { ReportTabs } from "@/components/ReportTabs";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = storage.getById(id);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Link>
        <div className="text-sm text-muted-foreground">
          <Calendar className="inline h-4 w-4 mr-1" />
          {new Date(report.createdAt).toLocaleString('zh-CN')}
        </div>
      </div>

      {/* Tracing ID Banner */}
      <div className="bg-muted/50 border rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">追踪 ID:</span>
          <span className="font-semibold">{report.tracingId}</span>
        </div>
      </div>

      {/* Tabs */}
      <ReportTabs report={report} />
    </div>
  );
}
