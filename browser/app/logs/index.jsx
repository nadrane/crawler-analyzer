import React from "react";
import FileUploader from "./file-uploader";
import DisplayLogs from "./display-logs";
import Card from "../card";

export default function Logs({ addLogLines, logs, selectLog, toggleLog, addEnv }) {
  return (
    <Card>
      <h4>Enter logs to analyze</h4>
      <DisplayLogs logs={logs} selectLog={selectLog} toggleLog={toggleLog} />
      <FileUploader addEnv={addEnv} addLogLines={addLogLines} />
    </Card>
  );
}
