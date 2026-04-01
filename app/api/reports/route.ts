import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

// GET /api/reports - Get all reports
export async function GET() {
  try {
    const reports = storage.getAll();
    return NextResponse.json({
      total: reports.length,
      reports: reports.map((r) => ({
        tracingId: r.tracingId,
        instanceId: r.instanceInfo.instanceId,
        spaceId: r.instanceInfo.spaceId,
        createdAt: r.createdAt,
        logsCount: r.clawLogs.logs.length,
        commandsCount: r.historyCommands.commands.length,
      })),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/reports - Create new report
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.tracingId) {
      return NextResponse.json({ error: "Missing tracingId" }, { status: 400 });
    }

    const report = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    storage.add(report);

    return NextResponse.json({
      success: true,
      tracingId: data.tracingId,
      message: "Report received successfully",
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
