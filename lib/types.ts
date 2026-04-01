export type InstanceInfo = {
  spaceId: string;
  instanceId: string;
  instanceCreatedTime?: string;
  envs: Record<string, string>;
};

export type ClawConfig = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  source: string;
  rootDir?: string;
  config: any;
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

export type DiagnosisReport = {
  tracingId: string;
  instanceInfo: InstanceInfo;
  clawConfig: ClawConfig;
  clawLogs: ClawLogs;
  historyCommands: HistoryCommands;
  createdAt: string;
};
