import * as React from "react";
import TimeIntervalPicker from "./time-interval-picker";
import Card from "../card";

interface Props {
  timeInterval: number;
  saveTimeInterval(interval: number): void;
}

export default function Options({ timeInterval, saveTimeInterval }: Props) {
  return (
    <Card>
      <TimeIntervalPicker timeInterval={timeInterval} saveTimeInterval={saveTimeInterval} />
    </Card>
  );
}
