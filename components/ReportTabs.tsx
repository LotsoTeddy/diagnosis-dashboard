"use client";

import { Server, Package, Terminal, FileText, Calendar } from "lucide-react";
import { Tabs } from "./Tabs";
import type { DiagnosisReport } from "@/lib/types";

export function ReportTabs({ report }: { report: DiagnosisReport }) {
  const envCount = Object.keys(report.instanceInfo.envs).length;
  const logEntriesCount = report.clawLogs.logs.reduce((sum, log) => sum + log.items.length, 0);

  const tabs = [
    {
      id: "instance",
      label: "实例信息",
      icon: <Server className="h-4 w-4" />,
    },
    {
      id: "config",
      label: "OpenClaw 配置",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "commands",
      label: `命令历史 (${report.historyCommands.commands.length})`,
      icon: <Terminal className="h-4 w-4" />,
    },
    {
      id: "logs",
      label: `日志 (${report.clawLogs.logs.length})`,
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs}>
        {/* Instance Information */}
        <div className="space-y-4">
          {/* Basic Info Card */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">实例 ID</div>
                <div className="font-mono text-sm font-medium">{report.instanceInfo.instanceId}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">空间 ID</div>
                <div className="font-mono text-sm font-medium">{report.instanceInfo.spaceId}</div>
              </div>
              {report.instanceInfo.instanceCreatedTime && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">创建时间</div>
                  <div className="font-mono text-sm font-medium">{report.instanceInfo.instanceCreatedTime}</div>
                </div>
              )}
            </div>
          </div>

          {/* Environment Variables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">环境变量</h3>
              <span className="text-xs text-muted-foreground">{envCount} 个变量</span>
            </div>
            <div className="border rounded-lg bg-muted/20">
              <div className="max-h-[400px] overflow-auto p-4">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold">变量名</th>
                      <th className="text-left py-2 px-2 font-semibold">值</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {Object.entries(report.instanceInfo.envs).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 px-2 text-muted-foreground">{key}</td>
                        <td className="py-2 px-2 break-all">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* OpenClaw Configuration */}
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y">
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-32">名称</td>
                  <td className="px-4 py-3 text-sm">{report.clawConfig.name}</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-32">ID</td>
                  <td className="px-4 py-3 text-sm font-mono">{report.clawConfig.id}</td>
                </tr>
                {report.clawConfig.version && (
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-32">版本</td>
                    <td className="px-4 py-3 text-sm">{report.clawConfig.version}</td>
                  </tr>
                )}
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-32">来源</td>
                  <td className="px-4 py-3 text-sm font-mono break-all">{report.clawConfig.source}</td>
                </tr>
                {report.clawConfig.description && (
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground w-32 align-top">描述</td>
                    <td className="px-4 py-3 text-sm">{report.clawConfig.description}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Command History */}
        <div>
          {report.historyCommands.commands.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Terminal className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">无命令记录</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/50 border-b">
                    <tr>
                      <th className="text-left py-2 px-4 font-semibold w-16">#</th>
                      <th className="text-left py-2 px-4 font-semibold">命令</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {report.historyCommands.commands.map((cmd, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="py-2 px-4 text-muted-foreground font-mono text-xs">{idx + 1}</td>
                        <td className="py-2 px-4 font-mono text-xs break-all">{cmd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="space-y-4">
          {report.clawLogs.logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">无日志数据</p>
            </div>
          ) : (
            report.clawLogs.logs.map((log) => (
              <div key={log.date} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-4 py-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{log.date}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.items.length} 条记录</span>
                </div>
                <div className="bg-muted/10 p-4 max-h-80 overflow-auto">
                  <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap">
                    {log.items.slice(0, 200).join("\n")}
                    {log.items.length > 200 && (
                      <span className="text-muted-foreground italic">
                        {"\n\n"}... 还有 {log.items.length - 200} 条记录（已省略）
                      </span>
                    )}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
