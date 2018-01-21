import React from "react";
import FileUploader from "./file-uploader";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.addLog = this.addLog.bind(this);
  }

  addLog(fileName, jsonLog) {
    this.setState(oldState => {
      return {
        ...oldState,
        [fileName]: jsonLog
      };
    });
  }

  render() {
    return <FileUploader addLog={this.addLog} />;
  }
}
