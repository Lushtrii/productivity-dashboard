import HabitSummary from "@/components/habit-summary";
import { HabitResult } from "@/lib/definitions";

interface HabitTrackerProps {
  habitData: HabitResult[];
}

export default function HabitTracker({ habitData }: HabitTrackerProps) {
  return (
    <div className="p-2 flex flex-col gap-4 border-3 rounded-2xl">
      <h1 className="text-2xl">Habit Tracker</h1>
      {habitData.map((habit) => {
        const { id: habitId, title: habitTitle } = habit;
        return (
          <HabitSummary
            title={habitTitle}
            previousCompletions={habit.completions.map((completion) =>
              JSON.stringify(completion),
            )}
            key={habitId}
          />
        );
      })}
    </div>
  );
}
