import { execSync } from "child_process";
import { InstanceInfo } from "../types";

function getEnvs(): Record<string, string> {
    const envs: Record<string, string> = {};

    try {
        const output = execSync("env", { encoding: "utf-8" });
        const lines = output.trim().split("\n");
        for (const line of lines) {
            const equalIndex = line.indexOf("=");
            if (equalIndex > 0) {
                const key = line.slice(0, equalIndex);
                const value = line.slice(equalIndex + 1);
                envs[key] = value;
            }
        }
    } catch (error) {
        console.error("Failed to get environment variables:", error);
    }

    return envs;
}

function getSpaceId(envs: Record<string, string>): string {
    return envs["O11YAGENT_ATTR_CLAW_SPACE_ID"] || "";
}

function getInstanceId(envs: Record<string, string>): string {
    return envs["O11YAGENT_ATTR_CLAW_SERVICE_NAME"] || "";
}

function getInstanceCreatedTime(): string {
    // get time from `stat -c %y /var/log/cloud-init.log`
    let timeString: string = "";
    try {
        timeString = execSync("stat -c %y /var/log/cloud-init.log", {
            encoding: "utf-8",
        });
    } catch (error) {
        console.error("Failed to get instance created time:", error);
    }

    return timeString;
}

export function getInstanceInfo(): InstanceInfo {
    // get envs from `env` command, each line is in format `key=value`
    const envs = getEnvs();
    const spaceId = getSpaceId(envs);
    const instanceId = getInstanceId(envs);
    const instanceCreatedTime = getInstanceCreatedTime();

    return {
        spaceId,
        instanceId,
        instanceCreatedTime,
        envs,
    };
}
