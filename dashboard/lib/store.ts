import fs from "fs"
import path from "path"
import type { Report, ReportSummary, ReportSection } from "./types"

const DATA_DIR = path.join(process.cwd(), "data")
const INDEX_FILE = path.join(DATA_DIR, "index.json")

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export function getReportList(): ReportSummary[] {
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"))
  } catch {
    return []
  }
}

export function getReportMeta(id: string): { id: string; instanceCreatedAt: string; createdAt: string } | undefined {
  const metaFile = path.join(DATA_DIR, id, "meta.json")
  try {
    return JSON.parse(fs.readFileSync(metaFile, "utf-8"))
  } catch {
    return undefined
  }
}

export function getReportSection(id: string, section: ReportSection): unknown {
  const file = path.join(DATA_DIR, id, `${section}.json`)
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"))
  } catch {
    return null
  }
}

export function addReport(data: Omit<Report, "createdAt">): ReportSummary {
  const createdAt = new Date().toISOString()
  const reportDir = path.join(DATA_DIR, data.id)
  ensureDir(reportDir)

  // Write each section separately
  fs.writeFileSync(path.join(reportDir, "meta.json"), JSON.stringify({
    id: data.id,
    instanceCreatedAt: data.instanceCreatedAt,
    createdAt,
  }, null, 2))

  fs.writeFileSync(path.join(reportDir, "env.json"), JSON.stringify({
    envVars: data.envVars || {},
  }, null, 2))

  fs.writeFileSync(path.join(reportDir, "config.json"), JSON.stringify({
    clawConfig: data.clawConfig || {},
  }, null, 2))

  fs.writeFileSync(path.join(reportDir, "sessions.json"), JSON.stringify({
    sessions: data.sessions || [],
  }, null, 2))

  fs.writeFileSync(path.join(reportDir, "logs.json"), JSON.stringify({
    logs: data.logs || [],
  }, null, 2))

  fs.writeFileSync(path.join(reportDir, "history.json"), JSON.stringify({
    history: data.history || [],
  }, null, 2))

  // Update index
  const summary: ReportSummary = {
    id: data.id,
    instanceCreatedAt: data.instanceCreatedAt,
    createdAt,
    sessionCount: data.sessions?.length ?? 0,
    logCount: data.logs?.length ?? 0,
  }
  const index = getReportList()
  index.unshift(summary)
  ensureDir(DATA_DIR)
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2))

  return summary
}
