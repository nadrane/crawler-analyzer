import * as React from "react";

import { LogEvents, SeriesConstraint } from "../interfaces";

const inititalState = {
  codeModule: "",
  event: "",
  aggregator: "",
  yAxis: "0"
};

interface Props {
  logEvents: LogEvents;
  addSeries(series: SeriesConstraint): void;
}

interface State {
  [key: string]: string;
  codeModule: string;
  event: string;
  aggregator: string;
  yAxis: string;
}

export default class SeriesComposer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = inititalState;
    this.seriesValid = this.seriesValid.bind(this);
    this.addSeries = this.addSeries.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCodeModules = this.getCodeModules.bind(this);
    this.getUniqueEvents = this.getUniqueEvents.bind(this);
    this.getAggregators = this.getAggregators.bind(this);
  }

  handleChange(
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>,
    field: string
  ) {
    const value = e.currentTarget.value;
    this.setState({
      [field]: value,
      aggregator:
        field === "event" && this.getAggregators(event).length === 1 ? this.getAggregators(event)[0] : ""
    });
  }

  seriesValid() {
    const { codeModule, event, aggregator, yAxis } = this.state;
    if (yAxis !== "0" && yAxis !== "1") return false;
    return codeModule && event && aggregator;
  }

  addSeries() {
    const { codeModule, event, aggregator, yAxis } = this.state;
    const name = `${codeModule} - ${aggregator} ${event}`;

    // I wish i knew a better way to pass in part of an interface without
    // not having to define id and active here
    this.props.addSeries({
      id: null,
      active: true,
      codeModule,
      event,
      aggregator,
      name,
      yAxis: parseInt(yAxis)
    });
    this.setState(inititalState);
  }

  getAggregators(event) {
    if (!event) {
      event = this.state.event;
    }
    if (!event) return [];
    if (event === "track response time") {
      return ["average", "median"];
    }
    return ["count"];
  }

  getCodeModules() {
    const { logEvents } = this.props;
    const uniqueCodeModules: string[] = [];

    for (const file of Object.values(logEvents)) {
      for (const codeModule of Object.keys(file)) {
        if (!uniqueCodeModules.includes(codeModule)) {
          uniqueCodeModules.push(codeModule);
        }
      }
    }

    return uniqueCodeModules;
  }

  getUniqueEvents(): string[] {
    const logEvents = this.props.logEvents;
    const codeModule = this.state.codeModule;

    if (!codeModule) return [];

    let availableEvents: Set<string> = new Set();
    for (const file of Object.values(logEvents)) {
      for (const event of file[codeModule]) {
        availableEvents = availableEvents.add(event);
      }
    }

    return [...availableEvents.values()];
  }

  renderSelect(getOptions, field: string) {
    const options = getOptions();
    if (options.length === 0 || options.length > 1) {
      options.unshift(`select a ${field}`);
    }
    return (
      <select
        className="custom-select form-control"
        value={this.state[field]}
        onChange={e => this.handleChange(e, field)}
      >
        {options.map(option => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    );
  }

  render() {
    const { codeModule } = this.state;
    const { logEvents } = this.props;
    return (
      <React.Fragment>
        <h4>Compose a series to graph</h4>
        <div className="form-group">{this.renderSelect(this.getCodeModules, "codeModule")}</div>
        <div className="form-group">{this.renderSelect(this.getUniqueEvents, "event")}</div>
        <div className="form-group">{this.renderSelect(this.getAggregators, "aggregator")}</div>
        <div className="form-group">
          <label htmlFor="yAxis">Y-Axis</label>
          <input
            id="yAxis"
            className="form-control"
            onChange={e => this.handleChange(e, "yAxis")}
            value={this.state.yAxis}
            type="text"
          />
        </div>
        <button className="btn btn-primary" disabled={!this.seriesValid()} onClick={this.addSeries}>
          Save Series
        </button>
      </React.Fragment>
    );
  }
}
