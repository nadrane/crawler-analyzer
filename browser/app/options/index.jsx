import React from "react";
import TimeIntervalPicker from "./time-interval-picker";
import Card from "../card";
module.exports = function Options({ timeInterval, saveTimeInterval }) {
  return (
    <Card>
      <TimeIntervalPicker timeInterval={timeInterval} saveTimeInterval={saveTimeInterval} />
    </Card>
  );
};
