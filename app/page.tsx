import TodoList from "@/components/todo-list";
import HabitTracker from "@/components/habit-tracker";
import { getAllTodos, getLastSevenDaysHabitResults } from "@/lib/data";

export default async function Home() {
  const habitData = await getLastSevenDaysHabitResults();
  const todoData = await getAllTodos();
  return (
    <main className="w-full grid grid-cols-2 grid-rows-2 gap-2 bg-white dark:bg-black sm:items-start">
      <HabitTracker habitData={habitData} />
      <TodoList todos={todoData} />
    </main>
  );
}
