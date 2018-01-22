import React from "react";
import FileUploader from "./file-uploader";
import Graph from "./graph";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.addLog = this.addLog.bind(this);
  }

  addLog(fileName, jsonLog) {
    this.setState(oldState => {
      return {
        ...oldState,
        [fileName]: jsonLog
      };
    });
  }

  logLoaded() {
    return Object.keys(this.state).length > 0;
  }

  render() {
    const logData = this.state;
    return (
      <div>
        {this.logLoaded() ? (
          <Graph logs={this.state} yAxis={[{ event: "request sent", codeModule: "requester" }]} />
        ) : null}
        <FileUploader addLog={this.addLog} />
      </div>
    );
  }
}
