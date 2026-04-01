import { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { PluginCommandContext } from "openclaw/plugin-sdk/core";
import { v4 as uuidv4 } from "uuid";
import { ArkClawDiagnosisData, ClawConfig } from "./types";
import { getHistoryCommands } from "./utils/get-history-commands";
import { getInstanceInfo } from "./utils/get-instance-info";
import { getOpenclawLogs } from "./utils/get-openclaw-logs";

export default function (api: OpenClawPluginApi) {
    api.registerCommand({
        name: "arkclaw-diagnosis",
        description: "A plugin for diagnosis ArkClaw",
        acceptsArgs: true,
        handler: async (ctx: PluginCommandContext) => {
            const arg = ctx.args?.[0];
            if (arg !== "allow") {
                return {
                    text: "Please allow diagnosis by running '/arkclaw-diagnosis allow'",
                };
            }
            const instanceInfo = getInstanceInfo();
            const clawConfig: ClawConfig = {
                id: api.id,
                name: api.name,
                version: api.version,
                description: api.description,
                source: api.source,
                rootDir: api.rootDir,
                config: api.config,
                pluginConfig: api.pluginConfig,
            };
            const historyCommands = getHistoryCommands();
            const clawLogs = getOpenclawLogs();

            const data: ArkClawDiagnosisData = {
                tracingId: uuidv4(),
                instanceInfo: instanceInfo,
                clawConfig: clawConfig,
                clawLogs: clawLogs,
                historyCommands: historyCommands,
            };

            try {
                // post data to Next.js API endpoint
                await fetch("http://localhost:3001/api/reports", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                return {
                    text: `Report success, tracing ID: ${data.tracingId}`,
                };
            } catch (error) {
                console.error("Failed to report diagnosis data:", error);
                return {
                    text: "Report failed, please try again later",
                };
            }
        },
    });
}
