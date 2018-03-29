import * as React from "react";

interface Props {
  timeInterval: number;
  saveTimeInterval(interval: number): void;
}

interface State {
  localTimeInteval: string;
}

export default class TimeIntervalPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.saveTimeInterval = this.saveTimeInterval.bind(this);
    this.state = {
      localTimeInteval: "0"
    };
  }

  handleClick(e: React.FormEvent<HTMLInputElement>) {
    const localTimeInteval = e.currentTarget.value;
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
            value={localTimeInteval}
            onChange={this.handleClick}
          />
        </div>

        <button className="btn btn-primary" onClick={this.saveTimeInterval}>
          Save Time Interval
        </button>
      </React.Fragment>
    );
  }
}
