import React from "react";

module.exports = function Table({ headers, contents }) {
  <table className="table">
    <thead>
      <tr>
        {headers.map(header => {
          <th scope="col">header</th>;
        })}
      </tr>
    </thead>
    <tbody>
      {contents.map(row => {
        <tr>
          {headers.map(header => {
            <td>{row[header]}</td>;
          })}
        </tr>;
      })}
    </tbody>
  </table>;
};
