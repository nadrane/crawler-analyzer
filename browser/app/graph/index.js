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
    const timeNormalizedLogs = logs.map(log => {
      return timeToNearestInterval(log, timeInterval);
    });

    const yAxis = [
      {
        // Primary yAxis
        title: {
          text: "counts",
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        }
      },
      {
        // Secondary yAxis
        title: {
          text: "averages/medians",
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        opposite: true
      }
    ];

    const config = {
      yAxis,
      xAxis: {
        type: "datetime"
      },
      plotOptions: {
        series: {
          pointStart: getEarliestTime(timeNormalizedLogs),
          pointInterval: timeInterval
        }
      },
      series: _.flatten(
        timeNormalizedLogs.map(log =>
          seriesConstraints.map(constraints => {
            return calculateSeries(log, constraints, timeInterval);
          })
        )
      )
    };

    return dataToGraphExists(logs, seriesConstraints) ? <ReactHighcharts config={config} /> : null;
  }
}

function getEarliestTime(logs) {
  return _.min(_.flatten(logs.map(log => log.map(line => line.time))));
}

function dataToGraphExists(logs, seriesConstraints) {
  return Object.keys(logs).length > 0 && seriesConstraints.length > 0;
}

function calculateSeries(data, constraints, timeInterval) {
  const filteredAndGroupedData = groupByTime(applyConstraints(data, constraints), timeInterval);
  return {
    data: mapAggregator(constraints.aggregator)(filteredAndGroupedData),
    name: constraints.name,
    yAxis: constraints.yAxis
  };
}

function mapAggregator(name) {
  return {
    count: aggregateByCount,
    average: aggregateByAverage,
    median: aggregateByMedian
  }[name];
}
