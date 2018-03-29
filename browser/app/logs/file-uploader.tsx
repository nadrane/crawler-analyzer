import * as React from "react";
import { ipcRenderer } from "electron";

import { LogLine, Env } from "../interfaces";

interface Props {
  addLogLines(fileName: string, newLines: LogLine[]): void;
  addEnv(fileName: string, env: Env): void;
}

export default class FileUploader extends React.Component<Props> {
  constructor(props: Props) {
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

  addEnv(event, { fileName, line: env }: { fileName: string; line: Env }) {
    this.props.addEnv(fileName, env);
  }

  addLines(event, { fileName, batch: lines }: { fileName: string; batch: LogLine[] }) {
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
