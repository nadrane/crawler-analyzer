import React from "react";
import FileUploader from "./file-uploader";
import Graph from "./graph";
import LogPicker from "./log-picker";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedLog: "",
      logs: {},
      seriesConstraints: [
        {
          name: "GETs per minute",
          event: "request sent",
          codeModule: "requester",
          aggregator: "time",
          fileName: "dev-concurrency-20"
        },
        {
          name: "robots per minute",
          event: "request sent",
          codeModule: "robots",
          aggregator: "time",
          fileName: "dev-concurrency-20"
        },
        {
          name: "cache hits",
          event: "cache hit",
          codeModule: "robots",
          aggregator: "time",
          fileName: "dev-concurrency-20"
        }
      ]
    };
    this.selectLog = this.selectLog.bind(this);
    this.addLog = this.addLog.bind(this);
  }

  selectLog(name) {
    this.setState({ selectedLog: name });
  }

  addLog(fileName, jsonLog) {
    this.setState(oldState => {
      return {
        logs: {
          ...oldState.logs,
          [fileName]: jsonLog
        }
      };
    });
  }

  logLoaded() {
    return Object.keys(this.state).length > 0;
  }

  render() {
    const { logs, seriesConstraints } = this.state;
    return (
      <div>
        <LogPicker selectLog={this.selectLog} logNames={Object.keys(this.state.logs)} />
        {seriesConstraints.length > 0 ? (
          <Graph logs={logs} seriesConstraints={seriesConstraints} />
        ) : null}
        <FileUploader addLog={this.addLog} />
      </div>
    );
  }
}
