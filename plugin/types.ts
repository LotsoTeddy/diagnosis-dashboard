import { OpenClawConfig } from "openclaw/plugin-sdk/core";

export type InstanceInfo = {
    spaceId: string;
    instanceId: string;
    instanceCreatedTime?: string;
    envs: Record<string, string>;
};

/* openclaw.json */
export type ClawConfig = {
    id: string;
    name: string;
    version?: string;
    description?: string;
    source: string;
    rootDir?: string;
    config: OpenClawConfig;
    pluginConfig?: Record<string, unknown>;
};

export type ClawLog = {
    date: string;
    items: string[];
};

export type ClawLogs = {
    logs: ClawLog[];
};

export type HistoryCommands = {
    commands: string[];
};

export type ArkClawDiagnosisData = {
    tracingId: string;
    instanceInfo: InstanceInfo;
    clawConfig: ClawConfig;
    clawLogs: ClawLogs;
    historyCommands: HistoryCommands;
};
