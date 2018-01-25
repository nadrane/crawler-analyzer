import React from "react";
import _ from "lodash";

const inititalState = {
  codeModule: "",
  event: "",
  aggregator: "",
  name: "",
  yAxis: "0"
};

module.exports = class SeriesComposer extends React.Component {
  constructor() {
    super();
    this.state = inititalState;
    this.seriesValid = this.seriesValid.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
  }

  handleChange(e, field) {
    this.setState({
      [field]: e.target.value
    });
  }

  seriesValid() {
    const { codeModule, event, aggregator, name, yAxis } = this.state;
    if (yAxis !== "0" && yAxis !== "1") return false;
    return codeModule && event && aggregator && name;
  }

  saveSeries() {
    const { codeModule, event, aggregator, name, yAxis } = this.state;
    this.props.saveSeries(codeModule, event, aggregator, name, parseInt(yAxis));
    this.setState(inititalState);
  }

  getAggregators() {
    return ["count", "average", "median"];
  }

  getUniqueEvents() {
    return _.uniq(this.props.logData.map(line => line.event)).filter(event => event);
  }

  getUniqueCodeModules() {
    return _.uniq(this.props.logData.map(line => line.codeModule)).filter(codeModule => codeModule);
  }

  renderSelect(getOptions, field) {
    return getOptions().length > 0 ? (
      <select value={this.state[field]} onChange={e => this.handleChange(e, field)}>
        <option key={`select a ${field}`} value={`select a ${field}`}>{`select a ${field}`}</option>
        {getOptions().map(option => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    ) : null;
  }

  render() {
    return this.props.logData ? (
      <div>
        <h2>Compose a series to graph</h2>
        <input onChange={e => this.handleChange(e, "name")} value={this.state.name} type="text" />
        {this.renderSelect(this.getUniqueCodeModules.bind(this), "codeModule")}
        {this.renderSelect(this.getUniqueEvents.bind(this), "event")}
        {this.renderSelect(this.getAggregators.bind(this), "aggregator")}
        <input onChange={e => this.handleChange(e, "yAxis")} value={this.state.yAxis} type="text" />
        <button disabled={!this.seriesValid()} onClick={this.saveSeries}>
          Save Series
        </button>
      </div>
    ) : null;
  }
};
