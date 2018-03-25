import React from "react";
import _ from "lodash";

export default class SelectCodeModule extends React.PureComponent {
  render() {
    const { codeModule, handleChange } = this.props;
    const logData = this.props.logData || [];
    const options = _.uniq(logData.map(line => line.codeModule)).filter(codeModule => codeModule);

    return (
      <select className="custom-select" value={codeModule} onChange={e => handleChange(e, "codeModule")}>
        <option
          key={`select a codeModule`}
          value={`select a codeModule`}
        >{`select a codeModule`}</option>
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
}
