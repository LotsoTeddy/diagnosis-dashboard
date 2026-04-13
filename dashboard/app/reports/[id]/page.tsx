import { notFound } from "next/navigation"
import Link from "next/link"
import { getReportMeta } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { InstanceTab } from "@/components/instance-tab"
import { SystemTab } from "@/components/system-tab"
import { ClawInfo } from "@/components/claw-info"

export const dynamic = "force-dynamic"

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const meta = getReportMeta(id)
  if (!meta) notFound()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="outline">&larr; 返回</Button>
        </Link>
        <h1 className="text-2xl font-bold ">{meta.id}</h1>
      </div>

      <Tabs defaultValue="instance">
        <TabsList>
          <TabsTrigger value="instance">实例信息</TabsTrigger>
          <TabsTrigger value="system">系统信息</TabsTrigger>
          <TabsTrigger value="claw">Claw 信息</TabsTrigger>
        </TabsList>

        <TabsContent value="instance">
          <InstanceTab reportId={id} instanceCreatedAt={meta.instanceCreatedAt} createdAt={meta.createdAt} />
        </TabsContent>

        <TabsContent value="system">
          <SystemTab reportId={id} />
        </TabsContent>

        <TabsContent value="claw">
          <ClawInfo reportId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
