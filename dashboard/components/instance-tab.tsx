"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function InstanceTab({ reportId, instanceCreatedAt, createdAt }: {
  reportId: string
  instanceCreatedAt: string
  createdAt: string
}) {
  const [envVars, setEnvVars] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/report/${reportId}/env`)
      .then((r) => r.json())
      .then((d) => setEnvVars(d?.envVars ?? {}))
      .catch(() => setEnvVars({}))
      .finally(() => setLoading(false))
  }, [reportId])

  const instanceId = envVars?.["O11YAGENT_ATTR_CLAW_SERVICE_NAME"] || "-"
  const spaceId = envVars?.["O11YAGENT_ATTR_CLAW_SPACE_ID"] || "-"

  return (
    <Card>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
          </div>
        ) : (
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
              <p className="text-sm">{instanceCreatedAt || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">上报时间</p>
              <p className="text-sm">{new Date(createdAt).toLocaleString("zh-CN")}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
