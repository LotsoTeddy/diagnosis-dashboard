import { LogoutButton } from "@/components/logout-button";
import { ReportList } from "@/components/report-list";
import { getReports } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function HomePage() {
    const reports = getReports();

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">ArkClaw EE 实例诊断</h1>
                <LogoutButton />
            </div>
            <ReportList reports={reports} />
        </div>
    );
}
