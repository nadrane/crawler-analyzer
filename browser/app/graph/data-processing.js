import _ from "lodash";

export const timeToNearestInterval = (data, timeInterval) => {
  return data.map(line => {
    const date = new Date(line.time);
    line.time = Math.round(date.getTime() / timeInterval) * timeInterval;
    return line;
  });
};

export const getMinTime = data => Math.min(...getXValues(data));
export const getXValues = data =>
  _.uniqBy(data.map(line => new Date(line.time)), date => date.getTime());

export const applyConstraints = (data, constraints) =>
  data.filter(line => constraints.event === line.event && constraints.codeModule === line.codeModule);

export const aggregateByCount = data => data.map(group => group.length);

export const aggregateByAverage = data => data.map(average);

export const average = group => {
  if (group.length === 0) return 0;
  return _.sum(group.map(event => event.data)) / group.length;
};

export const aggregateByMedian = group => group.map(median);

export const median = arr => {
  if (arr.length === 0) return 0;
  const sorted = arr.slice().sort((a, b) => a.data > b.data);
  const middleIndex = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middleIndex].data
    : (sorted[middleIndex].data + sorted[middleIndex - 1].data) / 2;
};

// FIX - account for case where there are gaps in the interval
export const groupByTime = (data, timeInterval) => {
  if (data.length === 0) return [];
  const times = data.map(line => line.time).sort();
  const validTimes = _.range(Math.min(...times), Math.max(...times) + 1, timeInterval);
  const timeGroups = {};

  for (const time of validTimes) {
    timeGroups[time] = [];
  }
  for (const line of data) {
    timeGroups[line.time].push(line);
  }
  return Object.values(timeGroups);
};
