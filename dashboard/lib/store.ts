import fs from "fs"
import path from "path"
import type { Report } from "./types"

const DATA_FILE = path.join(process.cwd(), "data", "reports.json")

export function getReports(): Report[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
  } catch {
    return []
  }
}

export function getReport(id: string): Report | undefined {
  return getReports().find((r) => r.id === id)
}

export function addReport(data: Omit<Report, "createdAt">): Report {
  const reports = getReports()
  const report: Report = { ...data, createdAt: new Date().toISOString() }
  reports.unshift(report)
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2))
  return report
}
