import { NextRequest, NextResponse } from "next/server"
import { getReportList, addReport } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getReportList())
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const summary = addReport(data)
  return NextResponse.json(summary, { status: 201 })
}
