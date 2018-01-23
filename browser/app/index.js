import React from "react";
import FileUploader from "./file-uploader";
import Graph from "./graph";
import LogPicker from "./log-picker";
import SeriesComposer from "./series-composer";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedLog: "",
      logs: {},
      seriesConstraints: []
    };
    this.selectLog = this.selectLog.bind(this);
    this.addLog = this.addLog.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
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

  saveSeries(codeModule, event, aggregator, name) {
    this.setState(oldState => ({
      seriesConstraints: oldState.seriesConstraints.concat({
        codeModule,
        event,
        aggregator,
        name,
        fileName: this.state.selectedLog
      })
    }));
  }

  logLoaded() {
    return Object.keys(this.state).length > 0;
  }

  render() {
    const { logs, seriesConstraints } = this.state;
    return (
      <div>
        <SeriesComposer logData={this.state.logs[this.state.selectedLog]} saveSeries={this.saveSeries} />
        <LogPicker selectLog={this.selectLog} logNames={Object.keys(this.state.logs)} />
        {this.selectedLog ? <SeriesComposer /> : null}
        {seriesConstraints.length > 0 ? (
          <Graph logs={logs} seriesConstraints={seriesConstraints} />
        ) : null}
        <FileUploader addLog={this.addLog} />
      </div>
    );
  }
}
