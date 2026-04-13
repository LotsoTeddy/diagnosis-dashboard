import { NextRequest, NextResponse } from "next/server"
import { getReportMeta, getReportSection } from "@/lib/store"
import type { ReportSection } from "@/lib/types"

const VALID_SECTIONS: ReportSection[] = ["env", "config", "sessions", "logs", "history"]

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; section: string }> }) {
  const { id, section } = await params

  if (!VALID_SECTIONS.includes(section as ReportSection)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 })
  }

  const meta = getReportMeta(id)
  if (!meta) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data = getReportSection(id, section as ReportSection)
  return NextResponse.json(data)
}
