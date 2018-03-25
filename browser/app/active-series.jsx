import React from "react";
import Card from "./card";

module.exports = function ActiveSeries({ seriesConstraints, toggleSeries }) {
  return (
    <Card>
      <table className="table">
        <thead>
          <tr>
            <th>Series</th>
            <th>Name</th>
            <th colSpan="2" align="right">
              Active
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(seriesConstraints).map(series => (
            <tr key={series.id}>
              <td>{series.name}</td>
              <td>{series.active.toString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={toggleSeries.bind(null, series.id)}
                >
                  Toggle Series
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
