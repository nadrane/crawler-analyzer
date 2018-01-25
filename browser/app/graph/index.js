"use strict";

import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts";
import ReactHighcharts from "react-highcharts";
import _ from "lodash";
import {
  timeToNearestInterval,
  groupByTime,
  applyConstraints,
  aggregateByCount,
  aggregateByAverage,
  aggregateByMedian
} from "./data-processing";

export default function Graph({ logs, seriesConstraints, timeInterval }) {
  {
    const timeNormalizedLogs = _.mapValues(logs, logData => {
      return timeToNearestInterval(logData, timeInterval);
    });

    const config = {
      xAxis: {
        type: "datetime"
      },
      plotOptions: {
        series: {
          //FIX - still should start from first interval of earliest log.
          // will be useful when only looking at a single logs data
          pointStart: Date.now(), //not all logs start at same time, so this is sort of moot
          pointInterval: timeInterval
        }
      },
      series: seriesConstraints.map(constraints => {
        return calculateSeries(timeNormalizedLogs, constraints, timeInterval);
      })
    };

    return dataToGraphExists(logs, seriesConstraints) ? <ReactHighcharts config={config} /> : null;
  }
}

function dataToGraphExists(logs, seriesConstraints) {
  return Object.keys(logs).length > 0 && seriesConstraints.length > 0;
}

function calculateSeries(logs, constraints, timeInterval) {
  if (!logs.hasOwnProperty(constraints.fileName)) return {};
  const data = logs[constraints.fileName];
  const filteredAndGroupedData = groupByTime(applyConstraints(data, constraints), timeInterval);
  return {
    data: mapAggregator(constraints.aggregator)(filteredAndGroupedData),
    name: constraints.name
  };
}

function mapAggregator(name) {
  return {
    count: aggregateByCount,
    average: aggregateByAverage,
    median: aggregateByMedian
  }[name];
}
