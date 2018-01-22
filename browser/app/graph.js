"use strict";

import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";
import ReactHighcharts from "react-highcharts";
import _ from "lodash";

export default function Graph({ logs, yAxis }) {
  {
    const logNames = Object.keys(logs);
    const name = logNames[0];
    const data = logs[name];

    const massagedData = timeToNearestMinute(data);

    const yAxisLineOne = yAxis[0];

    const config = {
      xAxis: { categories: getXValues(massagedData) },
      series: [
        { data: aggregateYValuesByTime(massagedData, applyYAxisConstraints(massagedData, yAxisLineOne)) }
      ]
    };

    return <ReactHighcharts config={config} />;
  }
}

const timeToNearestMinute = data => {
  return data.map(line => {
    const date = new Date(line.time);
    const oneMinute = 60 * 1000;
    line.time = Math.round(date.getTime() / oneMinute) * oneMinute;
    return line;
  });
};

const getXValues = data => _.uniqBy(data.map(line => new Date(line.time)), date => date.getTime());

const applyYAxisConstraints = (data, constraints) =>
  data.filter(line => constraints.event === line.event && constraints.codeModule === line.codeModule);

function aggregateYValuesByTime(data, yAxisConstraints) {
  const minX = Math.min(...getXValues(data));
  return data.reduce((line, accum) => {
    if (line.event !== yAxisConstraints.event && line.codeModule !== yAxisConstraints.codeModule)
      return accum;
    if (accum[line.time - minX]) {
      accum[line.time - minX] += 1;
    } else {
      accum[line.time - minX] = 1;
    }
    return accum;
  }, 0);
}
