import React from "react";
import _ from "lodash";
import SelectCodeModule from "./select-code-module";
import Card from "../card";

const inititalState = {
  codeModule: "",
  event: "",
  aggregator: "",
  yAxis: "0"
};

module.exports = class SeriesComposer extends React.Component {
  constructor() {
    super();
    this.state = inititalState;
    this.seriesValid = this.seriesValid.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
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

  saveSeries() {
    const { codeModule, event, aggregator, yAxis } = this.state;
    const name = `${codeModule}:${event} by ${aggregator}`;
    this.props.saveSeries(codeModule, event, aggregator, name, parseInt(yAxis));
    this.setState(inititalState);
  }

  getAggregators() {
    return ["count", "average", "median"];
  }

  getUniqueEvents() {
    const logData = this.props.logData || [];
    const codeModule = this.state.codeModule;
    if (!codeModule) return [];
    return _.uniq(
      logData
        .filter(line => line.codeModule === codeModule)
        .map(line => line.event)
        .filter(event => event)
    );
  }

  getUniqueCodeModules() {
    const logData = this.props.logData || [];
    return _.uniq(logData.map(line => line.codeModule)).filter(codeModule => codeModule);
  }

  renderSelect(getOptions, field) {
    const { logData } = this.props;
    return (
      <select
        className="custom-select form-control"
        value={this.state[field]}
        onChange={e => this.handleChange(e, field)}
      >
        <option key={`select a ${field}`} value={`select a ${field}`}>{`select a ${field}`}</option>
        {getOptions(logData).map(option => {
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
    const { logData } = this.props;
    return (
      <Card>
        <h4>Compose a series to graph</h4>
        <div className="form-group">
          <SelectCodeModule logData={logData} codeModule={codeModule} handleChange={this.handleChange} />
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
        <button className="btn btn-primary" disabled={!this.seriesValid()} onClick={this.saveSeries}>
          Save Series
        </button>
      </Card>
    );
  }
};
