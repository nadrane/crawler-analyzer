import { expect } from "chai";
import {
  median,
  average,
  groupByTime,
  aggregateByMedian,
  aggregateByAverage,
  aggregateByCount,
  applyConstraints,
  timeToNearestInterval
} from "../../../browser/app/graph/data-processing";

describe("data-processing", () => {
  describe("math functions", () => {
    describe("median", () => {
      it("returns 0 given an empty array", () => {
        expect(median([])).to.equal(0);
      });
      it("finds the median given an odd number of elements", () => {
        expect(median([{ data: 1 }])).to.equal(1);
        expect(median([{ data: 1 }, { data: 2 }, { data: 3 }])).to.equal(2);
      });
      it("finds the median given an even number of elements", () => {
        expect(median([{ data: 1 }, { data: 2 }])).to.equal(1.5);
        expect(median([{ data: 1 }, { data: 5 }, { data: 11 }, { data: 22 }])).to.equal(8);
      });
      it("finds the median given an unsorted array of elements", () => {
        expect(
          median([{ data: 12 }, { data: 2 }, { data: 5 }, { data: 10 }, { data: 16 }, { data: 73 }])
        ).to.equal(11);
      });
    });
    describe("average", () => {
      it("returns 0 given an empty array", () => {
        expect(average([])).to.equal(0);
      });
      it("returns the average", () => {
        expect(average([{ data: 1 }, { data: 2 }])).to.equal(1.5);
        expect(average([{ data: 2 }, { data: 5 }, { data: 11 }, { data: 22 }])).to.equal(10);
      });
    });
    describe("average", () => {
      it("returns 0 given an empty array", () => {
        expect(average([])).to.equal(0);
      });
      it("returns the average", () => {
        expect(average([{ data: 1 }, { data: 2 }])).to.equal(1.5);
        expect(average([{ data: 2 }, { data: 5 }, { data: 11 }, { data: 22 }])).to.equal(10);
      });
    });
  });
  describe("aggregators", () => {
    describe("aggregateByMedian", () => {
      it("maps a group of data sets to their medians", () => {
        const data = [
          [{ data: 1 }, { data: 2 }, { data: 1 }],
          [{ data: 2 }, { data: 20 }, { data: 10 }],
          [{ data: 2 }]
        ];
        expect(aggregateByMedian(data)).to.deep.equal([1, 10, 2]);
      });
    });
    describe("aggregateByMedian", () => {
      it("returns an empty array if given no data", () => {
        expect(aggregateByMedian([])).to.deep.equal([]);
      });
      it("maps a group of data sets to their medians", () => {
        const data = [
          [{ data: 1 }, { data: 2 }, { data: 1 }],
          [{ data: 2 }, { data: 20 }, { data: 10 }],
          [{ data: 2 }]
        ];
        expect(aggregateByMedian(data)).to.deep.equal([1, 10, 2]);
      });
    });
    describe("aggregateByAverage", () => {
      it("returns an empty array if given no data", () => {
        expect(aggregateByAverage([])).to.deep.equal([]);
      });
      it("maps a group of data sets to their averages", () => {
        const data = [
          [{ data: 1 }, { data: 4 }, { data: 1 }],
          [{ data: 2 }, { data: 20 }, { data: 11 }],
          [{ data: 2 }]
        ];
        expect(aggregateByAverage(data)).to.deep.equal([2, 11, 2]);
      });
    });
    describe("aggregateByCount", () => {
      it("returns an empty array if given no data", () => {
        expect(aggregateByMedian([])).to.deep.equal([]);
      });
      it("maps a group of data sets to their medians", () => {
        const data = [
          [{ data: 1 }, { data: 2 }, { data: 1 }],
          [{ data: 2 }],
          [{ data: 2 }, { data: 20 }]
        ];
        expect(aggregateByCount(data)).to.deep.equal([3, 1, 2]);
      });
    });
  });
  describe("groupByTime", () => {
    it("returns an empty array given no events", () => {
      expect(groupByTime([])).to.deep.equal([]);
    });
    it("groups together events based on the time interval they occurred in", () => {
      const data = [
        { data: 1, time: 1000 },
        { data: 2, time: 1000 },
        { data: 3, time: 2000 },
        { data: 4, time: 3000 }
      ];
      expect(groupByTime(data, 1000)).to.deep.equal([
        [{ data: 1, time: 1000 }, { data: 2, time: 1000 }],
        [{ data: 3, time: 2000 }],
        [{ data: 4, time: 3000 }]
      ]);
    });
    it("includes an empty array for time intervals without any events", () => {
      const data = [
        { data: 1, time: 1000 },
        { data: 2, time: 1000 },
        { data: 4, time: 3000 },
        { data: 5, time: 5000 }
      ];
      expect(groupByTime(data, 1000)).to.deep.equal([
        [{ data: 1, time: 1000 }, { data: 2, time: 1000 }],
        [],
        [{ data: 4, time: 3000 }],
        [],
        [{ data: 5, time: 5000 }]
      ]);
    });
    describe("applyConstraints", () => {
      it("removes all lines whose codeModule does the not match the codeModule constraint", () => {
        const data = [
          { data: 1, codeModule: "requester" },
          { data: 2, codeModule: "robots" },
          { data: 3, codeModule: "domains" },
          { data: 4, codeModule: "requester" }
        ];
        expect(applyConstraints(data, { codeModule: "requester" })).to.deep.equal([
          {
            data: 1,
            codeModule: "requester"
          },
          {
            data: 4,
            codeModule: "requester"
          }
        ]);
      });
      it("removes all lines whose event does the not match the event constraint", () => {
        const data = [
          { data: 1, event: "event 1" },
          { data: 2, event: "event 1" },
          { data: 3, event: "event 3" },
          { data: 4, event: "event 2" }
        ];
        expect(applyConstraints(data, { event: "event 1" })).to.deep.equal([
          {
            data: 1,
            event: "event 1"
          },
          {
            data: 2,
            event: "event 1"
          }
        ]);
      });
      it("removes all lines whose event and codeModule do not match the event and codeModule constraints", () => {
        const data = [
          { data: 1, event: "event 1", codeModule: "requester" },
          { data: 2, event: "event 1", codeModule: "robots" },
          { data: 3, event: "event 1", codeModule: "robots" },
          { data: 4, event: "event 2", codeModule: "robots" }
        ];
        expect(applyConstraints(data, { event: "event 1", codeModule: "requester" })).to.deep.equal([
          {
            data: 1,
            event: "event 1",
            codeModule: "requester"
          }
        ]);
      });
    });
    describe("timeToNearestInternal", () => {
      it("rounds down to the nearest interval", () => {
        const data = [
          { data: 1, time: 501010 },
          { data: 2, time: 501040 },
          { data: 3, time: 502499 },
          { data: 4, time: 503300 }
        ];
        const timeInterval = 1000;

        expect(timeToNearestInterval(data, timeInterval)).to.deep.equal([
          { data: 1, time: 501000 },
          { data: 2, time: 501000 },
          { data: 3, time: 502000 },
          { data: 4, time: 503000 }
        ]);
      });
      it("rounds up to the nearest interval", () => {
        const data = [
          { data: 1, time: 501500 },
          { data: 2, time: 501599 },
          { data: 3, time: 502700 },
          { data: 4, time: 503600 }
        ];
        const timeInterval = 1000;

        expect(timeToNearestInterval(data, timeInterval)).to.deep.equal([
          { data: 1, time: 502000 },
          { data: 2, time: 502000 },
          { data: 3, time: 503000 },
          { data: 4, time: 504000 }
        ]);
      });
    });
  });
});
