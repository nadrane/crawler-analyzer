import React from "react";
import TimeIntervalPicker from "./time-interval-picker";
import Card from "../card";

export default function Options({ timeInterval, saveTimeInterval }) {
  return (
    <Card>
      <TimeIntervalPicker timeInterval={timeInterval} saveTimeInterval={saveTimeInterval} />
    </Card>
  );
}
