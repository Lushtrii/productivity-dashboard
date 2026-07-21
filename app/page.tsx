import TodoList from "@/components/todo-list";
import HabitTracker from "@/components/habit-tracker";
import BlockSessionList from "@/components/block-session-list";
import {
  getAllTodos,
  getLastSevenDaysHabitResults,
  getActiveBlockSessions,
} from "@/lib/data";
import {
  ActiveBlockSessionSummary,
  HabitResult,
  Todo,
} from "@/lib/definitions";

const DEV_MODE = false;

export default async function Home() {
  const now = Temporal.Now.plainDateTimeISO();
  let habitData: HabitResult[];
  let todoData: Todo[];
  let blockSummaries: ActiveBlockSessionSummary[];
  if (!DEV_MODE) {
    habitData = await getLastSevenDaysHabitResults(
      now.toPlainDate().toString(),
    );
    todoData = await getAllTodos();
    blockSummaries = await getActiveBlockSessions(now.toString());
  } else {
    habitData = [];
    todoData = [];
    blockSummaries = [];
  }
  return (
    <main className="p-4 flex-1 grid grid-cols-2 grid-rows-2 gap-2 bg-white dark:bg-black sm:items-start">
      <HabitTracker currentDate={now.toPlainDate()} habitData={habitData} />
      <TodoList
        currentDateStr={now.toPlainDate().toString()}
        todoStrs={todoData.map((todo) => JSON.stringify(todo))}
      />
      <BlockSessionList currentDateTime={now} blocks={blockSummaries} />
    </main>
  );
}
