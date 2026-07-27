import TodoList from "@/components/todo-list";
import HabitTracker from "@/components/habit-tracker";
import BlockSessionList from "@/components/block-session-list";
import {
  getAllTodos,
  getLastSevenDaysHabitResults,
  getActiveBlockSessions,
  getEffectiveUserId,
} from "@/lib/data";
import { SignoutButton } from "@/components/sign-out";
import Image from "next/image";
import { GUEST_DEMO_ID } from "@/lib/definitions";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  const userId = await getEffectiveUserId();
  const demoModeEnabled = userId === GUEST_DEMO_ID;
  const now = Temporal.Now.plainDateTimeISO();
  const habitData = await getLastSevenDaysHabitResults(
    now.toPlainDate().toString(),
  );
  const todoData = await getAllTodos();
  const blockSummaries = await getActiveBlockSessions(now.toString());
  return (
    <>
      <header className="flex items-center justify-end h-12 ">
        <div className="flex gap-4 mr-8 items-center">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Github Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          {demoModeEnabled ? "Guest Mode" : session?.user?.name}
          <SignoutButton />
        </div>
      </header>
      <main className="pl-4 pb-4 pr-4 flex-1 flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-2 bg-white dark:bg-black sm:items-start">
        <HabitTracker currentDate={now.toPlainDate()} habitData={habitData} />
        <TodoList
          currentDateStr={now.toPlainDate().toString()}
          todoStrs={todoData.map((todo) => JSON.stringify(todo))}
        />
        <BlockSessionList currentDateTime={now} blocks={blockSummaries} />
      </main>
    </>
  );
}
