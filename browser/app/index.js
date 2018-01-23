import React from "react";
import FileUploader from "./file-uploader";
import Graph from "./graph";
import LogPicker from "./log-picker";
import SeriesComposer from "./series-composer";
import TimeIntervalPicker from "./time-interval-picker";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeInterval: 1000 * 60,
      selectedLog: "",
      logs: {},
      seriesConstraints: []
    };
    this.selectLog = this.selectLog.bind(this);
    this.addLog = this.addLog.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
    this.saveTimeInterval = this.saveTimeInterval.bind(this);
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

  saveTimeInterval(timeInterval) {
    this.setState({
      timeInterval
    });
  }

  render() {
    const { logs, seriesConstraints, timeInterval } = this.state;
    return (
      <div>
        <FileUploader addLog={this.addLog} />
        <TimeIntervalPicker
          timeInterval={this.state.timeInterval}
          saveTimeInterval={this.saveTimeInterval}
        />
        <LogPicker selectLog={this.selectLog} logNames={Object.keys(this.state.logs)} />
        <SeriesComposer logData={this.state.logs[this.state.selectedLog]} saveSeries={this.saveSeries} />
        {this.selectedLog ? <SeriesComposer /> : null}
        {seriesConstraints.length > 0 ? (
          <Graph logs={logs} seriesConstraints={seriesConstraints} timeInterval={timeInterval} />
        ) : null}
      </div>
    );
  }
}
