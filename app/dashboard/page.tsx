import TodoList from "@/components/todo-list";
import HabitTracker from "@/components/habit-tracker";
import BlockSessionList from "@/components/block-session-list";
import {
  getAllTodos,
  getLastSevenDaysHabitResults,
  getActiveBlockSessions,
} from "@/lib/data";
import { auth } from "@/auth";
import { SignoutButton } from "@/components/sign-out";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");
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
          {session?.user?.name}
          <SignoutButton />
        </div>
      </header>
      <main className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 bg-white dark:bg-black sm:items-start">
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
