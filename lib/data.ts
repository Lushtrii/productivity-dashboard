"use server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import sql from "./db";
import {
  ActiveBlockSessionSummary,
  GUEST_DEMO_ID,
  Habit,
  HabitCompletion,
  HabitResult,
  isTodo,
  Todo,
} from "@/lib/definitions";
import {
  convertTimesToTimeRanges,
  getActiveDaysArray,
  getHabitResultsFromQueries,
} from "./utils";

export async function getEffectiveUserId(): Promise<string> {
  const session = await auth();

  if (session?.user?.id) return session.user.id;

  const cookieStore = await cookies();
  if (cookieStore.has("demo_mode")) {
    const demoModeEnabled = cookieStore.get("demo_mode")?.value === "true";
    if (demoModeEnabled) return GUEST_DEMO_ID;
  }
  throw new Error("Not authenticated");
}

export async function getAllTodos(): Promise<Todo[]> {
  const userId = await getEffectiveUserId();
  const todos = await sql<
    Todo[]
  >`SELECT id, title, due_date, due_time, priority_level, is_complete, completion_time FROM todo_item WHERE user_id = ${userId} ORDER BY is_complete DESC, due_date, due_time, priority_level, id`;
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
  const userId = await getEffectiveUserId();
  if (userId === GUEST_DEMO_ID)
    throw new Error("Mutation blocked for demo mode.");
  if (isComplete) {
    const now = Temporal.Now.zonedDateTimeISO();
    await sql`UPDATE todo_item SET is_complete = true, completion_time = ${now.toString({ timeZoneName: "never" })} WHERE id = ${todoID} AND user_id = ${userId}`;
    return JSON.stringify(now.toPlainDateTime());
  } else {
    await sql`UPDATE todo_item SET is_complete = false, completion_time = null WHERE id = ${todoID} AND user_id = ${userId}`;
    return null;
  }
}

export async function addTodo(todoStr: string): Promise<string> {
  const userId = await getEffectiveUserId();
  if (userId === GUEST_DEMO_ID)
    throw new Error("Mutation blocked for demo mode.");
  const todo = JSON.parse(todoStr);
  if (todo.dueDate) {
    try {
      todo.dueDate = Temporal.PlainDate.from(todo.dueDate);
    } catch {
      throw new Error("Todo.dueDate is not in a valid format");
    }
  }
  if (todo.dueTime) {
    try {
      todo.dueTime = Temporal.PlainTime.from(todo.dueTime);
    } catch {
      throw new Error("Todo.dueTime is not in a valid format");
    }
  }
  if (!isTodo(todo)) {
    throw new Error("String is not a valid Todo instance");
  }
  if (todo.title === "") {
    throw new Error("Title must not be empty");
  }
  const dueDate = todo.dueDate !== null ? todo.dueDate.toString() : null;
  const dueTime = todo.dueTime !== null ? todo.dueTime.toString() : null;

  const result =
    await sql`INSERT INTO todo_item(title, due_date, due_time, priority_level, user_id) VALUES (${todo.title}, ${dueDate}, ${dueTime}, ${todo.priorityLevel}, ${userId}) RETURNING id`;
  return result[0].id;
}

export async function deleteTodo(todoId: string) {
  const userId = await getEffectiveUserId();
  if (userId === GUEST_DEMO_ID)
    throw new Error("Mutation blocked for demo mode.");
  await sql`DELETE FROM todo_item WHERE id = ${todoId} AND user_id = ${userId}`;
}

export async function getLastSevenDaysHabitResults(
  currentDateStr: string,
): Promise<HabitResult[]> {
  const userId = await getEffectiveUserId();
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  const sevenDaysPrior = currentDate.subtract({ weeks: 1 });
  const habitQuery = sql<
    Habit[]
  >`SELECT id, title FROM habit WHERE user_id = ${userId}`;
  const habitCompletionQuery = sql<
    HabitCompletion[]
  >`SELECT habit.id AS habit_id, habit_completion.id, habit_completion.target_date FROM habit_completion INNER JOIN habit ON habit_completion.habit_id = habit.id WHERE habit.user_id = ${userId} AND target_date >= ${sevenDaysPrior.toString()} AND target_date <= ${currentDate.toString()}`;
  const [habits, habitCompletions] = await Promise.all([
    habitQuery,
    habitCompletionQuery,
  ]);

  return getHabitResultsFromQueries(habits, habitCompletions);
}

export async function addHabitCompletion(
  habitId: string,
  targetDateStr: string,
): Promise<string> {
  const userId = await getEffectiveUserId();
  if (userId === GUEST_DEMO_ID)
    throw new Error("Mutation blocked for demo mode.");
  const result =
    await sql`INSERT INTO habit_completion (habit_id, target_date) VALUES (${habitId}, ${targetDateStr}) RETURNING id`;
  return result[0].id;
}

export async function addHabit(habitTitle: string): Promise<string> {
  const userId = await getEffectiveUserId();
  if (userId === GUEST_DEMO_ID)
    throw new Error("Mutation blocked for demo mode.");
  const result =
    await sql`INSERT INTO habit(title, user_id) VALUES (${habitTitle}, ${userId}) RETURNING id`;
  return result[0].id;
}

export async function deleteHabitCompletion(completionId: string) {
  const userId = await getEffectiveUserId();
  if (userId === GUEST_DEMO_ID)
    throw new Error("Mutation blocked for demo mode.");
  await sql`DELETE FROM habit_completion WHERE id = ${completionId}`;
}

export async function getActiveBlockSessions(
  currentDateTimeStr: string,
): Promise<ActiveBlockSessionSummary[]> {
  const userId = await getEffectiveUserId();
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
    AND user_id = ${userId}
    ORDER BY id
`;

  return result.map((session) => {
    return {
      id: session.id,
      title: session.title,
      activeTimes: convertTimesToTimeRanges(session.activeTimes),
      activeDays: getActiveDaysArray(session.activeDaysOfWeek),
    };
  });
}
