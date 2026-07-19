"use server";
import sql from "./db";
import {
  ActiveBlockSessionSummary,
  HabitResult,
  TimeRange,
  Todo,
} from "@/lib/definitions";

export async function getAllTodos(): Promise<Todo[]> {
  const todos = await sql<
    Todo[]
  >`SELECT id, title, due_date, due_time, priority_level, is_complete FROM todo_item ORDER BY is_complete DESC, due_date, due_time, priority_level, id`;
  return todos;
}

export async function updateTodoCompletion(
  todoID: string,
  isComplete: boolean,
) {
  await sql`UPDATE todo_item SET is_complete = ${isComplete} WHERE id = ${todoID}`;
}

export async function getLastSevenDaysHabitResults(
  currentDateStr: string,
): Promise<HabitResult[]> {
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  const habits = sql`SELECT id, title FROM habit ORDER BY id`;
  const sevenDaysPrior = currentDate.subtract({ weeks: 1 });
  const habitCompletions = sql`SELECT id, habit_id, target_date FROM habit_completion WHERE target_date >= ${sevenDaysPrior.toString()} AND target_date <= ${currentDate.toString()}`;

  const [habitResults, completionResults] = await Promise.all([
    habits,
    habitCompletions,
  ]);
  const habitMap = new Map();
  for (const completion of completionResults) {
    habitMap.getOrInsert(completion.habitId, []).push({
      id: completion.id,
      targetDate: completion.targetDate,
    });
  }

  const results = habitResults.map((habit) => ({
    id: habit.id,
    title: habit.title,
    completions: habitMap.get(habit.id) ?? [],
  }));

  return results;
}

export async function addHabitCompletion(
  habitId: string,
  targetDateStr: string,
): Promise<string> {
  const result =
    await sql`INSERT INTO habit_completion (habit_id, target_date) VALUES (${habitId}, ${targetDateStr}) RETURNING id`;
  return result[0].id;
}

export async function deleteHabitCompletion(completionId: string) {
  await sql`DELETE FROM habit_completion WHERE id = ${completionId}`;
}

function convertTimesToTimeRanges(times: string[]): TimeRange[] {
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

export async function getActiveBlockSessions(
  currentDateTimeStr: string,
): Promise<ActiveBlockSessionSummary[]> {
  // We store day of week schedule as a single number where the first seven bits represent days of the week
  const currentDateTime = Temporal.PlainDateTime.from(currentDateTimeStr);
  const dayBit = 1 << (currentDateTime.dayOfWeek - 1);
  const result = await sql`
  SELECT 
    id, 
    title,
    STRING_TO_ARRAY(TRANSLATE(active_times::text, '{}[]()', ''), ',') as active_times,
    active_days_of_week
  FROM block_session 
  WHERE (active_days_of_week & ${dayBit}) > 0 
    AND (active_times @> ${currentDateTime.toPlainTime().toString()}::time)
    ORDER BY id
`;

  const MONDAY_BIT = 1;
  const TUESDAY_BIT = 2;
  const WEDNESDAY_BIT = 4;
  const THURSDAY_BIT = 8;
  const FRIDAY_BIT = 16;
  const SATURDAY_BIT = 32;
  const SUNDAY_BIT = 64;

  return result.map((session) => {
    const activeDays = [
      (session.activeDaysOfWeek & MONDAY_BIT) > 0,
      (session.activeDaysOfWeek & TUESDAY_BIT) > 0,
      (session.activeDaysOfWeek & WEDNESDAY_BIT) > 0,
      (session.activeDaysOfWeek & THURSDAY_BIT) > 0,
      (session.activeDaysOfWeek & FRIDAY_BIT) > 0,
      (session.activeDaysOfWeek & SATURDAY_BIT) > 0,
      (session.activeDaysOfWeek & SUNDAY_BIT) > 0,
    ];

    return {
      id: session.id,
      title: session.title,
      activeTimes: convertTimesToTimeRanges(session.activeTimes),
      activeDays,
    };
  });
}
