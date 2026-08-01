import { Habit, HabitCompletion, HabitResult, TimeRange } from "./definitions";

export function convertTimesToTimeRanges(times: string[]): TimeRange[] {
  const result: TimeRange[] = [];
  for (let i = 0; i < times.length; i += 2) {
    const startTime = Temporal.PlainTime.from(times[i]);
    const endTime =
      times[i + 1] === "24:00:00"
        ? new Temporal.PlainTime(23, 59, 59)
        : Temporal.PlainTime.from(times[i + 1]);
    result.push({
      startTime,
      endTime,
    });
  }
  return result;
}

export function getActiveDaysArray(bitmask: number): boolean[] {
  const MONDAY_BIT = 1;
  const TUESDAY_BIT = 2;
  const WEDNESDAY_BIT = 4;
  const THURSDAY_BIT = 8;
  const FRIDAY_BIT = 16;
  const SATURDAY_BIT = 32;
  const SUNDAY_BIT = 64;
  return [
    (bitmask & MONDAY_BIT) > 0,
    (bitmask & TUESDAY_BIT) > 0,
    (bitmask & WEDNESDAY_BIT) > 0,
    (bitmask & THURSDAY_BIT) > 0,
    (bitmask & FRIDAY_BIT) > 0,
    (bitmask & SATURDAY_BIT) > 0,
    (bitmask & SUNDAY_BIT) > 0,
  ];
}

export function getHabitResultsFromQueries(
  habits: Habit[],
  habitCompletions: HabitCompletion[],
): HabitResult[] {
  const habitMap = new Map();

  for (const habitData of habits) {
    habitMap.getOrInsert(habitData.id, {
      title: habitData.title,
      completions: [],
    });
  }

  for (const completion of habitCompletions) {
    const habit = habitMap.get(completion.habitId);
    habit.completions.push({
      id: completion.id,
      targetDate: completion.targetDate,
      habitId: completion.habitId,
    });
  }

  const results = [];
  for (const [habitId, habitVal] of habitMap.entries()) {
    results.push({
      id: habitId,
      title: habitVal.title,
      completions: habitVal.completions,
    });
  }
  return results;
}
