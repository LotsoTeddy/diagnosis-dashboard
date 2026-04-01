import { execSync } from "child_process";
import { HistoryCommands } from "../types";

export function getHistoryCommands(): HistoryCommands {
    // execute `history` command and each line is a command
    const history = execSync("history").toString().trim();
    return {
        commands: history.split("\n"),
    };
}
