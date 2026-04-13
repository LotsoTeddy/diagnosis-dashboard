import { NextRequest, NextResponse } from "next/server"
import { getReportList, addReport } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getReportList())
}

export async function POST(req: NextRequest) {
  console.log("[POST /api/report] 收到请求")
  try {
    const data = await req.json()
    console.log("[POST /api/report] 解析完成, id:", data.id)
    const summary = addReport(data)
    console.log("[POST /api/report] 存储完成, id:", summary.id)
    return NextResponse.json(summary, { status: 201 })
  } catch (e) {
    console.error("[POST /api/report] 错误:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
