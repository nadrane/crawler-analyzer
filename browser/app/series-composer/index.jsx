import React from "react";

import Card from "../card";
import SeriesComposer from "./series-composer";
import ActiveSeries from "./active-series";

export default function Series({ series, fileMetaData, addSeries, toggleSeries }) {
  return (
    <Card>
      <div className="row">
        <div className="col-sm">
          <SeriesComposer addSeries={addSeries} fileMetaData={fileMetaData} />
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
