import React from "react";
import { ipcRenderer } from "electron";

// Send async message to main process

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileLoad = this.handleFileLoad.bind(this);
    this.addLines = this.addLines.bind(this);
    this.addEnv = this.addEnv.bind(this);
  }

  componentDidMount() {
    ipcRenderer.addListener("file-line-parsed", this.addLines);
    ipcRenderer.addListener("env-parsed", this.addEnv);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("file-line-parsed", this.addLines);
    ipcRenderer.addListener("env-parsed", this.addEnv);
  }

  handleFileLoad(e) {
    ipcRenderer.send("load-file");
  }

  addEnv(event, { fileName, line: env }) {
    this.props.addEnv(fileName, env);
  }

  addLines(event, { fileName, batch: lines }) {
    this.props.addLogLines(fileName, lines);
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.handleFileLoad}>
        Load Log File
      </button>
    );
  }
}
