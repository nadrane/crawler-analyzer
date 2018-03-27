import React from "react";
import { Map } from "immutable";

export default class SelectCodeModule extends React.PureComponent {
  render() {
    const { codeModule, handleChange, fileMetaData } = this.props;
    const codeModuleOptions = fileMetaData.flatMap(oneFile => oneFile.get("events", Map())).keySeq();

    return (
      <select className="custom-select" value={codeModule} onChange={e => handleChange(e, "codeModule")}>
        <option
          key={`select a codeModule`}
          value={`select a codeModule`}
        >{`select a codeModule`}</option>
        {codeModuleOptions.map(option => {
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
