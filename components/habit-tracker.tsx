import HabitSummary from "@/components/habit-summary";
import { HabitResult } from "@/lib/data";

interface HabitTrackerProps {
  habitData: HabitResult[];
}

export default function HabitTracker({ habitData }: HabitTrackerProps) {
  return (
    <div className="w-1/2 p-2 flex flex-col gap-4 border-3 rounded-2xl">
      <h1 className="text-2xl">Habit Tracker</h1>
      {habitData.map((habit) => {
        const { id: habitId, title: habitTitle } = habit;
        return (
          <HabitSummary
            title={habitTitle}
            completions={habit.completions}
            key={habitId}
          />
        );
      })}
    </div>
  );
}
