import { Map, Set } from "immutable";
import React from "react";
import Graph from "./graph";
import Logs from "./logs";
import SeriesComposer from "./series-composer";
import Options from "./options/";
import ActiveSeries from "./active-series";

let logId = 0;
let seriesId = 0;

const fileNameIdMap = {};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeInterval: 1000 * 60,
      logs: {},
      seriesConstraints: {},
      fileMetaData: Map()
    };
    this.toggleLog = this.toggleLog.bind(this);
    this.toggleSeries = this.toggleSeries.bind(this);
    this.addLogLines = this.addLogLines.bind(this);
    this.addSeries = this.addSeries.bind(this);
    this.saveTimeInterval = this.saveTimeInterval.bind(this);
  }

  addLogLines(fileName, lines) {
    // Assign the fileName an id
    if (!fileNameIdMap[fileName]) {
      logId++;
      fileNameIdMap[fileName] = logId;
    }
    let id = fileNameIdMap[fileName];

    // Store which events exist for each codeModule on a per file basis
    lines.forEach(line => {
      const { codeModule, event: newEvent } = line;
      if (!codeModule || !newEvent) return;
      const modulesForEvent = this.state.fileMetaData.getIn([id, codeModule]);

      if (!modulesForEvent) {
        this.setState(oldState => {
          return {
            fileMetaData: oldState.fileMetaData.setIn([id, codeModule], Set([newEvent]))
          };
        });
      } else if (!modulesForEvent.includes(newEvent)) {
        this.setState(oldState => {
          return {
            fileMetaData: oldState.fileMetaData.updateIn([id, codeModule], eventSet => {
              return eventSet.add(newEvent);
            })
          };
        });
      }
    });

    // Store the actual log information
    this.setState(oldState => {
      const otherLogs = {
        logs: {
          ...oldState.logs
        }
      };
      const updatedLog = { ...(oldState.logs[id] || { id, fileName, active: true, value: [] }) };
      updatedLog.value = [...updatedLog.value, ...lines];
      otherLogs.logs[id] = updatedLog;
      return otherLogs;
    });
  }

  toggleLog(id) {
    this.setState(oldState => {
      const { value, active, fileName } = oldState.logs[id];
      return {
        logs: {
          ...oldState.logs,
          [id]: {
            id,
            fileName,
            value,
            active: !active
          }
        }
      };
    });
  }

  addSeries(codeModule, event, aggregator, name, yAxis) {
    this.setState(oldState => {
      seriesId++;
      return {
        seriesConstraints: {
          ...oldState.seriesConstraints,
          [seriesId]: {
            id: seriesId,
            name,
            codeModule,
            event,
            aggregator,
            yAxis,
            active: true
          }
        }
      };
    });
  }

  toggleSeries(id) {
    this.setState(oldState => {
      const series = oldState.seriesConstraints[id];
      return {
        seriesConstraints: {
          ...oldState.seriesConstraints,
          [id]: {
            ...series,
            active: !series.active
          }
        }
      };
    });
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
    const { logs, seriesConstraints, timeInterval, fileMetaData } = this.state;
    const seriesExist = Object.keys(seriesConstraints).length > 0;
    return (
      <div className="container">
        <div className="row">
          <Logs
            addLogLines={this.addLogLines}
            selectLog={this.selectLog}
            logs={this.state.logs}
            toggleLog={this.toggleLog}
          />
          <SeriesComposer fileMetaData={fileMetaData} addSeries={this.addSeries} />
        </div>
        <div className="row">
          {seriesExist && (
            <ActiveSeries seriesConstraints={seriesConstraints} toggleSeries={this.toggleSeries} />
          )}
        </div>
        <div className="row">
          {seriesConstraints.length > 0 ? (
            <React.Fragment>
              <Options timeInterval={this.state.timeInterval} saveTimeInterval={this.saveTimeInterval} />
              <Graph
                logs={this.getActiveLogData()}
                seriesConstraints={seriesConstraints}
                timeInterval={timeInterval}
              />
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}
