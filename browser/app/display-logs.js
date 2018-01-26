import React from "react";

export default function DisplayLogs({ logs, toggleLog }) {
  return Object.keys(logs).length > 0 ? (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Loaded Logs</th>
            <th>Active</th>
            <th>Toggle Log</th>
          </tr>
          {Object.entries(logs).map(([name, { active }]) => {
            return (
              <tr key={name} onClick={toggleLog.bind(null, name)}>
                <td>{name}</td>
                <td>{active.toString()}</td>
                <td>{active ? "X" : "\u2713"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;
}
