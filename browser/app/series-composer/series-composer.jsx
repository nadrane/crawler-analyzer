import React from "react";
import { Set } from "immutable";

import SelectCodeModule from "./select-code-module";

const inititalState = {
  codeModule: "",
  event: "",
  aggregator: "",
  yAxis: "0"
};

export default class SeriesComposer extends React.Component {
  constructor() {
    super();
    this.state = inititalState;
    this.seriesValid = this.seriesValid.bind(this);
    this.addSeries = this.addSeries.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, field) {
    this.setState({
      [field]: e.target.value
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
    this.props.addSeries(codeModule, event, aggregator, name, parseInt(yAxis));
    this.setState(inititalState);
  }

  getAggregators() {
    return ["count", "average", "median"];
  }

  getUniqueEvents() {
    const fileMetaData = this.props.fileMetaData;
    const codeModule = this.state.codeModule;

    if (!codeModule) return [];

    let events = new Set();
    for (const file of fileMetaData.values()) {
      events = events.union(file.get("events").get(codeModule));
    }
    return events.keySeq();
  }

  renderSelect(getOptions, field) {
    return (
      <select
        className="custom-select form-control"
        value={this.state[field]}
        onChange={e => this.handleChange(e, field)}
      >
        <option key={`select a ${field}`} value={`select a ${field}`}>{`select a ${field}`}</option>
        {getOptions().map(option => {
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
    const { fileMetaData } = this.props;
    return (
      <React.Fragment>
        <h4>Compose a series to graph</h4>
        <div className="form-group">
          <SelectCodeModule
            fileMetaData={fileMetaData}
            codeModule={codeModule}
            handleChange={this.handleChange}
          />
        </div>
        <div className="form-group">{this.renderSelect(this.getUniqueEvents.bind(this), "event")}</div>
        <div className="form-group">
          {this.renderSelect(this.getAggregators.bind(this), "aggregator")}
        </div>
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
