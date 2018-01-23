"use strict";

import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";
import ReactHighcharts from "react-highcharts";
import _ from "lodash";

export default function Graph({ logs, seriesConstraints }) {
  {
    const timeNormalizedLogs = _.mapValues(logs, logData => {
      return timeToNearestMinute(logData);
    });

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
        return calculateSeries(timeNormalizedLogs, constraints);
      })
    };

    return dataToGraphExists(logs, seriesConstraints) ? <ReactHighcharts config={config} /> : null;
  }
}

function dataToGraphExists(logs, seriesConstraints) {
  return Object.keys(logs).length > 0 && seriesConstraints.length > 0;
}

function calculateSeries(logs, constraints) {
  if (!logs.hasOwnProperty(constraints.fileName)) return {};
  const data = logs[constraints.fileName];
  const filteredAndGroupedData = groupByTime(applyYAxisConstraints(data, constraints));
  return {
    data: mapAggregator(constraints.aggregator)(filteredAndGroupedData),
    name: constraints.name
  };
}

const groupByTime = data => Object.values(_.groupBy(data, line => line.time));

function mapAggregator(name) {
  return {
    count: aggregateByCount,
    average: aggregateByAverage,
    median: aggregateByMedian
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

const aggregateByCount = data => data.map(group => group.length);

const aggregateByAverage = data => data.map(average);

const average = group => _.sum(group.map(event => event.data)) / group.length;

const aggregateByMedian = group => group.map(median);

const median = group =>
  group.length % 2 === 1
    ? group[group.length / 2].data
    : (group[group.length / 2].data + group[group.length / 2 + 1].data) / 2;
