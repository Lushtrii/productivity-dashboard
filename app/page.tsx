import TodoList from "@/components/todo-list";
import HabitTracker from "@/components/habit-tracker";
import BlockSessionList from "@/components/block-session-list";
import {
  getAllTodos,
  getLastSevenDaysHabitResults,
  getActiveBlockSessions,
} from "@/lib/data";

export default async function Home() {
  const habitData = await getLastSevenDaysHabitResults();
  const todoData = await getAllTodos();
  const blockSummaries = await getActiveBlockSessions();
  return (
    <main className="w-full grid grid-cols-2 grid-rows-2 gap-2 bg-white dark:bg-black sm:items-start">
      <HabitTracker habitData={habitData} />
      <TodoList todos={todoData} />
      <BlockSessionList blocks={blockSummaries} />
    </main>
  );
}
