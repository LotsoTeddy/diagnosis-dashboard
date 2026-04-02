import { NextRequest, NextResponse } from "next/server"
import { getReports, addReport } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getReports())
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const report = addReport(data)
  return NextResponse.json(report, { status: 201 })
}
