import * as React from "react";
import FileUploader from "./file-uploader";
import DisplayLogs from "./display-logs";
import Card from "../card";

import { Logs, LogLine, Env } from "../interfaces";

interface Props {
  logs: Logs;
  toggleLog(id: number): void;
  addLogLines(fileName: string, newLines: LogLine[]): void;
  addEnv(fileName: string, env: Env): void;
}

export default function Logs({ addLogLines, logs, toggleLog, addEnv }: Props) {
  return (
    <Card>
      <h4 className="text-center mb-5">Enter logs to analyze</h4>
      <DisplayLogs logs={logs} toggleLog={toggleLog} />
      <FileUploader addEnv={addEnv} addLogLines={addLogLines} />
    </Card>
  );
}
