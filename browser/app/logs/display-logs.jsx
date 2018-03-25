import React from "react";

export default function DisplayLogs({ logs, toggleLog }) {
  return Object.keys(logs).length > 0 ? (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Loaded Logs</th>
            <th colSpan="2" align="right">
              Active
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(logs).map(({ id, fileName, active }) => {
            const dateName = new Date(parseInt(fileName));
            return (
              <tr key={id} onClick={toggleLog.bind(null, id)}>
                <td>{dateName.toLocaleDateString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td>{active.toString()}</td>
                <td>
                  <button className="btn btn-secondary btn-sm">Toggle Log</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No logs have been loaded</p>
  );
}
