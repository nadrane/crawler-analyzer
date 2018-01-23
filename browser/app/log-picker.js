import React from "react";

module.exports = class LogPicker extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.selectLog(e.target.textContent);
  }

  areAnyLogsLoaded() {
    return this.props.logNames.length > 0;
  }

  render() {
    const { logNames } = this.props;
    return this.areAnyLogsLoaded() ? (
      <div>
        <h2>Pick a log to graph</h2>
        {logNames.map(name => (
          <p key={name} onClick={this.handleClick}>
            {name}
          </p>
        ))}
      </div>
    ) : null;
  }
};
