import React from "react";

module.exports = class TimeIntervalPicker extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.saveTimeInterval = this.saveTimeInterval.bind(this);
    this.state = {
      localTimeInteval: 0
    };
  }

  handleClick(e) {
    const localTimeInteval = e.target.value;
    this.setState({
      localTimeInteval
    });
  }

  saveTimeInterval() {
    const newTimeInterval = parseInt(eval(this.state.localTimeInteval));
    if (!newTimeInterval) return;
    this.props.saveTimeInterval(newTimeInterval);
  }

  render() {
    const { timeInterval } = this.props;
    const { localTimeInteval } = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="timeInterval">Pick a time interval (ms)</label>
          <input
            id="timeInterval"
            className="form-control"
            value={localTimeInteval !== 0 ? localTimeInteval : timeInterval}
            onChange={this.handleClick}
          />
        </div>

        <button className="btn btn-primary" onClick={this.saveTimeInterval}>
          Save Time Interval
        </button>
      </React.Fragment>
    );
  }
};
