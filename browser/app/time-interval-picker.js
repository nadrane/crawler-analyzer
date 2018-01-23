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
      <div>
        <p>Pick a time interval (ms)</p>
        <input
          value={localTimeInteval !== 0 ? localTimeInteval : timeInterval}
          onChange={this.handleClick}
        />
        <button onClick={this.saveTimeInterval}>Save Time Interval</button>
      </div>
    );
  }
};
