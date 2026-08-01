import { describe, it, expect } from "vitest";
import {
  convertTimesToTimeRanges,
  getActiveDaysArray,
  getHabitResultsFromQueries,
} from "./utils";
import { Habit, HabitCompletion, HabitResult } from "./definitions";

describe("convertTimesToTimeRanges", () => {
  it("converts array of time strings into PlainTime objects", () => {
    const input = ["09:00:00", "17:00:00"];
    const result = convertTimesToTimeRanges(input);

    expect(result).toHaveLength(1);
    expect(result[0].startTime.toString()).toBe("09:00:00");
    expect(result[0].endTime.toString()).toBe("17:00:00");
  });

  it("converts multiple ranges", () => {
    const input = ["09:00:00", "17:00:00", "18:00:00", "23:00:00"];
    const result = convertTimesToTimeRanges(input);

    expect(result).toHaveLength(2);
    expect(result[0].startTime.toString()).toBe("09:00:00");
    expect(result[0].endTime.toString()).toBe("17:00:00");
    expect(result[1].startTime.toString()).toBe("18:00:00");
    expect(result[1].endTime.toString()).toBe("23:00:00");
  });

  it("doesn't allow arrays of odd length", () => {
    const input = ["03:00:00", "05:00:00", "07:00:00"];
    expect(() => convertTimesToTimeRanges(input)).toThrow();
  });
});

describe("getActiveDaysArray", () => {
  it("correctly maps single-day bit masks to 7-element boolean arrays", () => {
    // 1 = Monday (2^0)
    // 2 = Tuesday (2^1)
    // 4 = Wednesday (2^2)
    // 8 = Thursday (2^3)
    // 16 = Friday (2^4)
    // 32 = Saturday (2^5)
    // 64 = Sunday (2^6)

    expect(getActiveDaysArray(1)).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(getActiveDaysArray(16)).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
      false,
    ]);
    expect(getActiveDaysArray(64)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it("correctly maps multi-day schedules", () => {
    // Weekends = Sat (32) + Sunday (64)
    const WEEKEND_MASK = 96;
    expect(getActiveDaysArray(WEEKEND_MASK)).toEqual([
      false,
      false,
      false,
      false,
      false,
      true,
      true,
    ]);

    // Weekdays = Monday (1) + Tuesday (2) + Wednesday (4) + Thursday (8) + Friday (16)
    const WEEKDAY_MASK = 31;
    expect(getActiveDaysArray(WEEKDAY_MASK)).toEqual([
      true,
      true,
      true,
      true,
      true,
      false,
      false,
    ]);
  });

  it("handles no day schedules", () => {
    expect(getActiveDaysArray(0)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});

describe("getHabitResultsFromQueries", () => {
  it("converts a habit and completions into habit results", () => {
    const habits: Habit[] = [
      {
        id: "019fbebf-b578-77d6-ab58-1784fb35065c",
        title: "Sleep 8 hours a day",
      },
    ];
    const habitCompletions: HabitCompletion[] = [
      {
        habitId: "019fbebf-b578-77d6-ab58-1784fb35065c",
        id: "019fbec1-0ac9-7a29-b777-1944315cd081",
        targetDate: Temporal.PlainDate.from("2026-07-31"),
      },
      {
        habitId: "019fbebf-b578-77d6-ab58-1784fb35065c",
        id: "019fbec1-0ac9-7a29-b777-1944315cd082",
        targetDate: Temporal.PlainDate.from("2026-07-30"),
      },
      {
        habitId: "019fbebf-b578-77d6-ab58-1784fb35065c",
        id: "019fbec1-0ac9-7a29-b777-1944315cd083",
        targetDate: Temporal.PlainDate.from("2026-07-28"),
      },
    ];
    const expectedOutput: HabitResult[] = [
      {
        id: habits[0].id,
        title: habits[0].title,
        completions: habitCompletions,
      },
    ];
    const result = getHabitResultsFromQueries(habits, habitCompletions);
    expect(result).toHaveLength(1);
    expect(result).toEqual(expectedOutput);
  });

  it("handles habits with no completions", () => {
    const habits: Habit[] = [
      {
        id: "019fbebf-b578-77d6-ab58-1784fb35065c",
        title: "Sleep 8 hours a day",
      },
      {
        id: "019fbebf-b578-77d6-ab58-1784fb35065d",
        title: "Eat fruit",
      },
    ];
    const habitCompletions: HabitCompletion[] = [
      {
        habitId: "019fbebf-b578-77d6-ab58-1784fb35065c",
        id: "019fbec1-0ac9-7a29-b777-1944315cd081",
        targetDate: Temporal.PlainDate.from("2026-07-31"),
      },
      {
        habitId: "019fbebf-b578-77d6-ab58-1784fb35065c",
        id: "019fbec1-0ac9-7a29-b777-1944315cd082",
        targetDate: Temporal.PlainDate.from("2026-07-30"),
      },
      {
        habitId: "019fbebf-b578-77d6-ab58-1784fb35065c",
        id: "019fbec1-0ac9-7a29-b777-1944315cd083",
        targetDate: Temporal.PlainDate.from("2026-07-28"),
      },
    ];

    const expectedOutput = [
      {
        id: habits[0].id,
        title: habits[0].title,
        completions: habitCompletions,
      },
      {
        id: habits[1].id,
        title: habits[1].title,
        completions: [],
      },
    ];
    const result = getHabitResultsFromQueries(habits, habitCompletions);
    expect(result).toHaveLength(2);
    expect(result).toEqual(expectedOutput);
  });
});
