import React from "react";
import FileUploader from "./file-uploader";
import DisplayLogs from "./display-logs";
import Card from "../card";

module.exports = function Logs({ addLogLines, logs, selectLog, toggleLog }) {
  return (
    <Card>
      <h4>Enter logs to analyze</h4>
      <DisplayLogs logs={logs} selectLog={selectLog} toggleLog={toggleLog} />
      <FileUploader addLogLines={addLogLines} />
    </Card>
  );
};
