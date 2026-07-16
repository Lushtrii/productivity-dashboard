import HabitTracker from "@/components/habit-tracker";
import { getLastSevenDaysHabitResults } from "@/lib/data";

export default async function Home() {
  const habitData = await getLastSevenDaysHabitResults();
  return (
    <main className="w-full bg-white dark:bg-black sm:items-start">
      <HabitTracker habitData={habitData} />
    </main>
  );
}
