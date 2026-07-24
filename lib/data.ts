"use server";
import { auth } from "@/auth";
import sql from "./db";
import {
  ActiveBlockSessionSummary,
  HabitResult,
  TimeRange,
  Todo,
} from "@/lib/definitions";

export async function getAllTodos(): Promise<Todo[]> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
  const todos = await sql<
    Todo[]
  >`SELECT id, title, due_date, due_time, priority_level, is_complete, completion_time FROM todo_item WHERE user_id = ${session.user?.id} ORDER BY is_complete DESC, due_date, due_time, priority_level, id`;
  return todos;
}

export async function findOrCreateUser(
  provider: string,
  providerAccountId: string | number,
): Promise<string> {
  const provider_map = new Map();
  provider_map.set("github", "github_id");

  const provider_column = provider_map.get(provider);
  const existingId =
    await sql`SELECT id FROM "user" WHERE ${sql(provider_column)} = ${providerAccountId}`;
  if (existingId.length === 0) {
    const result =
      await sql`INSERT INTO "user"(${sql(provider_column)}) VALUES (${providerAccountId}) RETURNING id`;
    return result[0].id;
  }
  return existingId[0].id;
}

export async function updateTodoCompletion(
  todoID: string,
  isComplete: boolean,
): Promise<string | null> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
  if (isComplete) {
    const now = Temporal.Now.zonedDateTimeISO();
    await sql`UPDATE todo_item SET is_complete = true, completion_time = ${now.toString({ timeZoneName: "never" })} WHERE id = ${todoID} AND user_id = ${session?.user?.id}`;
    return JSON.stringify(now.toPlainDateTime());
  } else {
    await sql`UPDATE todo_item SET is_complete = false, completion_time = null WHERE id = ${todoID} AND user_id = ${session.user?.id}`;
    return null;
  }
}

export async function deleteTodo(todoId: string) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
  await sql`DELETE FROM todo_item WHERE id = ${todoId} AND user_id = ${session.user?.id}`;
}

export async function getLastSevenDaysHabitResults(
  currentDateStr: string,
): Promise<HabitResult[]> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  const sevenDaysPrior = currentDate.subtract({ weeks: 1 });
  const habitResults =
    await sql`SELECT habit.id AS habit_id, habit.title, habit_completion.id, habit_completion.target_date FROM habit_completion INNER JOIN habit ON habit_completion.habit_id = habit.id WHERE habit.user_id = ${session.user?.id} AND target_date >= ${sevenDaysPrior.toString()} AND target_date <= ${currentDate.toString()}`;

  const habitMap = new Map();
  for (const habitData of habitResults) {
    const habit = habitMap.getOrInsert(habitData.habitId, {
      title: habitData.title,
      completions: [],
    });
    habit.completions.push({
      id: habitData.id,
      targetDate: habitData.targetDate,
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

export async function addHabitCompletion(
  habitId: string,
  targetDateStr: string,
): Promise<string> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
  const result =
    await sql`INSERT INTO habit_completion (habit_id, target_date) VALUES (${habitId}, ${targetDateStr}) RETURNING id`;
  return result[0].id;
}

export async function deleteHabitCompletion(completionId: string) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
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
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");
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
    AND user_id = ${session.user?.id}
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
