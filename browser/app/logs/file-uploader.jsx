import React from "react";
import { ipcRenderer } from "electron";

// Send async message to main process

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileLoad = this.handleFileLoad.bind(this);
    this.fileLoaded = this.fileLoaded.bind(this);
  }

  componentDidMount() {
    ipcRenderer.addListener("file-loaded", this.fileLoaded);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("file-loaded", this.fileLoaded);
  }

  handleFileLoad(e) {
    ipcRenderer.send("load-file");
  }

  fileLoaded(event, logs) {
    this.props.addLog(logs.fileName, logs.jsonLog);
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.handleFileLoad}>
        Load Log File
      </button>
    );
  }
}
