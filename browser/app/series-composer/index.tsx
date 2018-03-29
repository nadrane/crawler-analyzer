import * as React from "react";

import Card from "../card";
import SeriesComposer from "./series-composer";
import ActiveSeries from "./active-series";
import { LogEvents, SeriesConstraint } from "../interfaces";

interface Props {
  series: { [key: number]: SeriesConstraint };
  logEvents: LogEvents;
  addSeries(series: SeriesConstraint): void;
  toggleSeries(seriesId: number): void;
}

export default function Series({ series, logEvents, addSeries, toggleSeries }: Props) {
  return (
    <Card>
      <div className="row">
        <div className="col-sm">
          <SeriesComposer addSeries={addSeries} logEvents={logEvents} />
        </div>
        {!!Object.keys(series).length && (
          <div className="col-sm">
            <ActiveSeries toggleSeries={toggleSeries} series={series} />
          </div>
        )}
      </div>
    </Card>
  );
}
