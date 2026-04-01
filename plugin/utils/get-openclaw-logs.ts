import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { ClawLog, ClawLogs } from "../types";

/**
 * Parse a single log file and extract date and log items
 * @param logFilePath - Path to the log file (e.g., /tmp/openclaw/openclaw-2026-03-30.log)
 * @returns ClawLog object with date and items
 */
function getOpenclawLog(logFilePath: string): ClawLog | null {
    try {
        // Extract date from filename: openclaw-2026-03-30.log -> 2026-03-30
        const filename = logFilePath.split("/").pop() || "";
        const dateMatch = filename.match(/openclaw-(\d{4}-\d{2}-\d{2})\.log$/);

        if (!dateMatch) {
            console.error("Invalid log filename format:", filename);
            return null;
        }

        const date = dateMatch[1];

        // Read file and split into lines
        const content = readFileSync(logFilePath, "utf-8");
        const items = content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0); // Remove empty lines

        return {
            date,
            items,
        };
    } catch (error) {
        console.error("Failed to read log file:", logFilePath, error);
        return null;
    }
}

/**
 * Get all openclaw logs from /tmp/openclaw/ directory
 * @returns ClawLogs object containing all log files
 */
export function getOpenclawLogs(): ClawLogs {
    const LOG_DIR = "/tmp/openclaw";
    const logs: ClawLog[] = [];

    try {
        // Check if directory exists
        if (!existsSync(LOG_DIR)) {
            console.warn("Log directory does not exist:", LOG_DIR);
            return { logs };
        }

        // Read all files in the directory
        const files = readdirSync(LOG_DIR);

        // Filter and process log files
        for (const file of files) {
            // Only process files matching the pattern openclaw-*.log
            if (file.startsWith("openclaw-") && file.endsWith(".log")) {
                const logFilePath = join(LOG_DIR, file);
                const log = getOpenclawLog(logFilePath);

                if (log) {
                    logs.push(log);
                }
            }
        }

        // Sort logs by date (newest first)
        logs.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
        console.error("Failed to read openclaw logs:", error);
    }

    return { logs };
}
