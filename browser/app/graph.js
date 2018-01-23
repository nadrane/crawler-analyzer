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
    const yAxisLineOne = yAxis[0];
    const timeNormalizedData = timeToNearestMinute(data);
    const series = calculateSeries(timeNormalizedData, yAxisLineOne);

    const config = {
      xAxis: {
        type: "datetime"
      },
      plotOptions: {
        series: {
          pointStart: Date.now(), //FIX ME
          pointInterval: 1000 * 60 // one minute
        }
      },

      series: [series]
    };

    return <ReactHighcharts config={config} />;
  }
}

function calculateSeries(data, constraints) {
  const filteredData = applyYAxisConstraints(data, constraints);
  const aggregatedData = aggregateYValuesByTime(filteredData, constraints);
  return {
    data: aggregatedData,
    name: constraints.name
  };
}

const timeToNearestMinute = data => {
  return data.map(line => {
    const date = new Date(line.time);
    const oneMinute = 60 * 1000;
    line.time = Math.round(date.getTime() / oneMinute) * oneMinute;
    return line;
  });
};

const getMinTime = data => Math.min(...getXValues(data));
const getXValues = data => _.uniqBy(data.map(line => new Date(line.time)), date => date.getTime());

const applyYAxisConstraints = (data, constraints) =>
  data.filter(line => constraints.event === line.event && constraints.codeModule === line.codeModule);

function aggregateYValuesByTime(data, yAxisConstraints) {
  const minX = Math.min(...getXValues(data));
  return (
    data
      .reduce((accum, line) => {
        if (line.event !== yAxisConstraints.event && line.codeModule !== yAxisConstraints.codeModule)
          return accum;
        if (accum[line.time - minX]) {
          accum[line.time - minX] += 1;
        } else {
          accum[line.time - minX] = 1;
        }
        return accum;
      }, [])
      // There are going to be a ton of holes because Date.getTime is measured using milliseconds,
      // but we are indexing the array based on minute increments
      .filter(values => values)
  );
}
