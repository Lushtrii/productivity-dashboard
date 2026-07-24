import TodoList from "@/components/todo-list";
import HabitTracker from "@/components/habit-tracker";
import BlockSessionList from "@/components/block-session-list";
import {
  getAllTodos,
  getLastSevenDaysHabitResults,
  getActiveBlockSessions,
} from "@/lib/data";

export default async function Dashboard() {
  const now = Temporal.Now.plainDateTimeISO();
  const habitData = await getLastSevenDaysHabitResults(
    now.toPlainDate().toString(),
  );
  const todoData = await getAllTodos();
  const blockSummaries = await getActiveBlockSessions(now.toString());
  return (
    <main className="w-full grid grid-cols-2 grid-rows-2 gap-2 bg-white dark:bg-black sm:items-start">
      <HabitTracker currentDate={now.toPlainDate()} habitData={habitData} />
      <TodoList
        currentDateStr={now.toPlainDate().toString()}
        todoStrs={todoData.map((todo) => JSON.stringify(todo))}
      />
      <BlockSessionList currentDateTime={now} blocks={blockSummaries} />
    </main>
  );
}
