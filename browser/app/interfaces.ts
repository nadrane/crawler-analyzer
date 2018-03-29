export interface Log {
  id: number;
  fileName: string;
  value: LogLine[];
  active: boolean;
}

export interface LogLine {
  hostname: string;
  pid: number;
  codeModule: string;
  event: string;
  level: number;
  time: string;
  msg: string;
  url: string;
  domain: string;
  subdomain: string;
  value?: string;
}

export interface Logs {
  [key: number]: Log;
}

export interface SeriesConstraint {
  id: number;
  name: string;
  codeModule: string;
  event: string;
  aggregator: string;
  yAxis: number;
  active: boolean;
}

export interface SeriesConstraints {
  [key: number]: SeriesConstraint;
}

export interface LogEvents {
  [key: number]: {
    // code module: [event name]
    [key: string]: Set<string>;
  };
}

export interface Env {
  // env property: env value
  [key: string]: string;
}

export interface LogEnv {
  [key: number]: Env;
}
