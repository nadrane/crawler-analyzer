import React from "react";
import _ from "lodash";
import SelectCodeModule from "./select-code-module";

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
    this.handleChange = this.handleChange.bind(this);
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
      <select value={this.state[field]} onChange={e => this.handleChange(e, field)}>
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
      <div>
        <h2>Compose a series to graph</h2>
        <input onChange={e => this.handleChange(e, "name")} value={this.state.name} type="text" />
        <SelectCodeModule logData={logData} codeModule={codeModule} handleChange={this.handleChange} />
        {this.renderSelect(this.getUniqueEvents.bind(this), "event")}
        {this.renderSelect(this.getAggregators.bind(this), "aggregator")}
        <input onChange={e => this.handleChange(e, "yAxis")} value={this.state.yAxis} type="text" />
        <button disabled={!this.seriesValid()} onClick={this.saveSeries}>
          Save Series
        </button>
      </div>
    );
  }
};
