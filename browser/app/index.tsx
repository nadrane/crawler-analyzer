import * as React from "react";
import * as _ from "lodash";

import { SeriesConstraints, SeriesConstraint, LogEvents, LogEnv, LogLine, Logs } from "./interfaces";
import Graph from "./graph";
import UploadAndDisplayLogs from "./logs";
import SeriesComposer from "./series-composer";
import Options from "./options/";

let logId = 0;
let seriesId = 0;

interface FileNameIdMap {
  [key: string]: number;
}

interface Props {}
interface State {
  timeInterval: number;
  logs: Logs;
  seriesConstraints: SeriesConstraints;
  logEvents: LogEvents;
  logEnv: LogEnv;
}

const fileNameIdMap: FileNameIdMap = {};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      timeInterval: 1000 * 60,
      logs: {},
      seriesConstraints: {},
      logEvents: {},
      logEnv: {}
    };

    this.toggleLog = this.toggleLog.bind(this);
    this.addLogLines = this.addLogLines.bind(this);
    this.addEnv = this.addEnv.bind(this);

    this.addSeries = this.addSeries.bind(this);
    this.toggleSeries = this.toggleSeries.bind(this);

    this.saveTimeInterval = this.saveTimeInterval.bind(this);
  }

  addEnv(fileName: string, env: { [key: string]: string }) {
    // Assign the fileName an id
    fileNameIdMap[fileName] = ++logId;

    this.setState((oldState: State): { logEnv: LogEnv; logEvents: LogEvents; logs: Logs } => {
      const logEnv = Object.assign(oldState.logEnv, { [logId]: env });
      const logEvents = Object.assign(oldState.logEvents, { [logId]: {} });
      const logs = Object.assign(oldState.logs, {
        [logId]: { id: logId, fileName, active: true, value: [] }
      });
      return {
        logEnv,
        logEvents,
        logs
      };
    });
  }

  addLogLines(fileName: string, lines: LogLine[]) {
    let id = fileNameIdMap[fileName];

    // Store which events exist for each codeModule on a per file basis
    lines.forEach(line => {
      const { codeModule, event: newEvent } = line;

      if (!codeModule || !newEvent) {
        console.log("invalid log file. No codeModule or event specified", line);
        return;
      }

      const existingEventsForModule = this.state.logEvents[id][codeModule];
      let newEventsForModule: Set<string>;
      if (!existingEventsForModule) {
        newEventsForModule = new Set([newEvent]);
      } else if (!existingEventsForModule.has(newEvent)) {
        newEventsForModule = new Set([...existingEventsForModule.values(), newEvent]);
      }
      if (!newEventsForModule) return;

      this.setState((oldState): { logEvents: LogEvents } => {
        return {
          logEvents: {
            ...oldState.logEvents,
            [id]: {
              ...oldState.logEvents[id],
              [codeModule]: newEventsForModule
            }
          }
        };
      });
    });

    // Store the actual log information
    this.setState((oldState): { logs: { [key: number]: Log } } => {
      const updatedLogValue = [...oldState.logs[id].value, ...lines];
      return {
        logs: {
          ...oldState.logs,
          [id]: {
            ...oldState.logs[id],
            value: updatedLogValue
          }
        }
      };
    });
  }

  toggleLog(id: number) {
    this.setState((oldState): { logs: Logs } => {
      return {
        logs: {
          ...oldState.logs,
          [id]: {
            ...oldState.logs[id],
            active: !oldState.logs[id].active
          }
        }
      };
    });
  }

  addSeries(series: SeriesConstraint) {
    this.setState(oldState => {
      return {
        seriesConstraints: {
          ...oldState.seriesConstraints,
          [seriesId]: {
            ...series,
            id: ++seriesId,
            active: true
          }
        }
      };
    });
  }

  toggleSeries(id: number) {
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

  saveTimeInterval(timeInterval: number) {
    this.setState({
      timeInterval
    });
  }

  getActiveLogs() {
    const { logs } = this.state;
    return _.pickBy(logs, log => log.active);
  }

  // getActiveLogData() {
  //   return Object.values(this.getActiveLogs()).map(log => log.value);
  // }

  getActiveSeries() {
    return _.pickBy(this.state.seriesConstraints, series => series.active);
  }

  render() {
    const { logs, seriesConstraints, timeInterval, logEvents } = this.state;
    const seriesExist = Object.keys(seriesConstraints).length > 0;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col" />
          <div className="col-11 col-sm-8 col-md-7 col-lg-7 col-xl-6">
            <UploadAndDisplayLogs
              addLogLines={this.addLogLines}
              addEnv={this.addEnv}
              logs={this.state.logs}
              toggleLog={this.toggleLog}
            />
          </div>
          <div className="col" />
        </div>
        {Object.keys(logs).length > 0 && (
          <div className="row">
            <div className="col" />
            <div className="col-11 col-sm-8 col-md-7 col-lg-7 col-xl-6">
              <SeriesComposer
                logEvents={logEvents}
                series={seriesConstraints}
                addSeries={this.addSeries}
                toggleSeries={this.toggleSeries}
              />
            </div>
            <div className="col" />
          </div>
        )}
        <div className="row">
          {Object.keys(seriesConstraints).length > 0 ? (
            <React.Fragment>
              <Options timeInterval={this.state.timeInterval} saveTimeInterval={this.saveTimeInterval} />
              {/* <Graph
                logs={this.getActiveLogData()}
                seriesConstraints={seriesConstraints}
                timeInterval={timeInterval}
              /> */}
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}
