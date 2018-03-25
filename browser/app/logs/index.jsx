import React from "react";
import FileUploader from "./file-uploader";
import DisplayLogs from "./display-logs";
import Card from "../card";

module.exports = function Logs({ addLog, logs, selectLog, toggleLog }) {
  return (
    <Card>
      <h4>Enter logs to analyze</h4>
      <FileUploader addLog={addLog} />
      <DisplayLogs logs={logs} selectLog={selectLog} toggleLog={toggleLog} />
    </Card>
  );
};
