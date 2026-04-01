import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { DiagnosisReport } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const REPORTS_FILE = join(DATA_DIR, "reports.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty reports file if it doesn't exist
if (!existsSync(REPORTS_FILE)) {
  writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
}

export const storage = {
  getAll(): DiagnosisReport[] {
    try {
      const data = readFileSync(REPORTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getById(tracingId: string): DiagnosisReport | undefined {
    const reports = this.getAll();
    return reports.find((r) => r.tracingId === tracingId);
  },

  add(report: DiagnosisReport): void {
    const reports = this.getAll();
    reports.unshift(report);
    writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
  },

  delete(tracingId: string): boolean {
    const reports = this.getAll();
    const filtered = reports.filter((r) => r.tracingId !== tracingId);
    if (filtered.length < reports.length) {
      writeFileSync(REPORTS_FILE, JSON.stringify(filtered, null, 2));
      return true;
    }
    return false;
  },
};
