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
  targetDate: Temporal;
}

export async function getAllTodos(): Promise<Todo[]> {
  const todos = await sql<Todo[]>`SELECT * FROM todo_item`;
  return todos;
}

export async function getLastSevenDaysHabitResults(): Promise<HabitResult[]> {
  const habits = sql`SELECT id, title FROM habit`;

  const sevenDaysPrior = DateTime.now().toLocal().minus({ weeks: 1 });
  const habitCompletions = sql`SELECT id, habit_id, target_date FROM habit_completion WHERE target_date >= ${sevenDaysPrior.toISODate()} AND target_date <= ${DateTime.now().toLocal().toISODate()}`;

  const [habitResults, completionResults] = await Promise.all([
    habits,
    habitCompletions,
  ]);
  const habitMap = new Map();
  for (const completion of completionResults) {
    habitMap.getOrInsert(completion.habitId, []).push({
      id: completion.id,
      targetDate: DateTime.fromSQL(completion.targetDate),
    });
  }

  const results = habitResults.map((habit) => ({
    id: habit.id,
    title: habit.title,
    completions: habitMap.get(habit.id) ?? [],
  }));

  return results;
}
