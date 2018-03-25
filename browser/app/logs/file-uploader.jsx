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
    ipcRenderer.addListener("file-line-parsed", this.fileLoaded);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("file-line-parsed", this.fileLoaded);
  }

  handleFileLoad(e) {
    ipcRenderer.send("load-file");
  }

  fileLoaded(event, { fileName, batch: lines }) {
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
