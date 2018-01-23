"use strict";

import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";
import ReactHighcharts from "react-highcharts";
import _ from "lodash";

export default function Graph({ logs, seriesConstraints }) {
  {
    const data = Object.values(logs)[0];
    const timeNormalizedData = timeToNearestMinute(data);

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
      series: seriesConstraints.map(constraints => {
        return calculateSeries(timeNormalizedData, constraints);
      })
    };

    return <ReactHighcharts config={config} />;
  }
}

function calculateSeries(data, constraints) {
  return {
    data: mapAggregator(constraints.aggregator)(applyYAxisConstraints(data, constraints)),
    name: constraints.name
  };
}

function mapAggregator(name) {
  return {
    time: aggregateYValuesByTime
  }[name];
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

function aggregateYValuesByTime(data) {
  const minX = Math.min(...getXValues(data));
  return (
    data
      .reduce((accum, line) => {
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
