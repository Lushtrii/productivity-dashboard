import HabitSummary from "@/components/habit-summary";
import { HabitResult } from "@/lib/definitions";

interface HabitTrackerProps {
  currentDate: Temporal.PlainDate;
  habitData: HabitResult[];
}

export default function HabitTracker({
  currentDate,
  habitData,
}: HabitTrackerProps) {
  return (
    <div className="p-2 flex flex-col gap-4 border-3 rounded-2xl">
      <h1 className="text-2xl">Habit Tracker</h1>
      {habitData.map((habit) => {
        const { id: habitId, title: habitTitle } = habit;
        return (
          <HabitSummary
            endDateStr={currentDate.toString()}
            id={habitId}
            title={habitTitle}
            completions={habit.completions}
            key={habitId}
          />
        );
      })}
    </div>
  );
}
