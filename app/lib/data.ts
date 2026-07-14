import sql from "./db";

interface Todo {
  id: string;
  title: string;
  dueDate: string;
  createdAt: string;
  priorityLevel: number;
  isComplete: boolean;
  completionTime: string;
}

interface HabitResult {
  id: string;
  title: string;
  completions: HabitCompletion[];
}

interface HabitCompletion {
  id: string;
  targetDate: Temporal.PlainDate;
}

interface ActiveBlockSessionSummary {
  id: string;
  title: string;
  activeTimes: TimeRange[];
}

interface TimeRange {
  startTime: Temporal.PlainTime;
  endTime: Temporal.PlainTime;
}

export async function getAllTodos(): Promise<Todo[]> {
  const todos = await sql<Todo[]>`SELECT * FROM todo_item`;
  return todos;
}

export async function getLastSevenDaysHabitResults(): Promise<HabitResult[]> {
  const habits = sql`SELECT id, title FROM habit`;

  const currentDate = Temporal.Now.plainDateISO();
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

export async function getActiveBlockSessions(): Promise<
  ActiveBlockSessionSummary[]
> {
  const now = Temporal.Now.plainDateTimeISO();
  // We store day of week schedule as a single number where the first seven bits represent days of the week
  const dayBit = now.dayOfWeek === 7 ? 1 : 1 << now.dayOfWeek;
  const result = await sql`
  SELECT 
    id, 
    title,
    STRING_TO_ARRAY(TRANSLATE(active_times::text, '{}[]()', ''), ',') as active_times
  FROM block_session 
  WHERE (active_days_of_week & ${dayBit}) > 0 
    AND (active_times @> ${now.toPlainTime().toString()}::time)
`;
  return result.map((session) => ({
    id: session.id,
    title: session.title,
    activeTimes: convertTimesToTimeRanges(session.activeTimes),
  }));
}
