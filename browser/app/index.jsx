import React from "react";
import Graph from "./graph";
import Logs from "./logs";
import SeriesComposer from "./series-composer";
import Options from "./options/";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeInterval: 1000 * 60,
      logs: {},
      seriesConstraints: []
    };
    this.toggleLog = this.toggleLog.bind(this);
    this.addLog = this.addLog.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
    this.saveTimeInterval = this.saveTimeInterval.bind(this);
  }

  toggleLog(name) {
    this.setState(oldState => ({
      logs: {
        ...oldState.logs,
        [name]: {
          value: oldState.logs[name].value,
          active: !oldState.logs[name].active
        }
      }
    }));
  }

  addLog(fileName, jsonLog) {
    this.setState(oldState => {
      return {
        logs: {
          ...oldState.logs,
          [fileName]: {
            value: jsonLog,
            active: true
          }
        }
      };
    });
  }

  saveSeries(codeModule, event, aggregator, name, yAxis) {
    this.setState(oldState => ({
      seriesConstraints: oldState.seriesConstraints.concat({
        codeModule,
        event,
        aggregator,
        name,
        yAxis
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

  getActiveLogs() {
    const { logs } = this.state;
    return _.pickBy(logs, log => log.active);
  }

  getActiveLogData() {
    return Object.values(this.getActiveLogs()).map(log => log.value);
  }

  render() {
    const { logs, seriesConstraints, timeInterval } = this.state;
    return (
      <div className="container">
        <div className="row">
          <Logs
            addLog={this.addLog}
            selectLog={this.selectLog}
            logs={this.state.logs}
            toggleLog={this.toggleLog}
          />
          <SeriesComposer logData={_.concat(...this.getActiveLogData())} saveSeries={this.saveSeries} />
          {seriesConstraints.length > 0 ? (
            <Graph
              logs={this.getActiveLogData()}
              seriesConstraints={seriesConstraints}
              timeInterval={timeInterval}
            />
          ) : null}
          <Options timeInterval={this.state.timeInterval} saveTimeInterval={this.saveTimeInterval} />
        </div>
      </div>
    );
  }
}
