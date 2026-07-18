import { Check } from "lucide-react";
import clsx from "clsx";
import { HabitCompletion } from "@/lib/definitions";

interface HabitSummaryProps {
  currentDateStr: string;
  title: string;
  completions: HabitCompletion[];
}

export default function HabitSummary({
  currentDateStr,
  title,
  completions,
}: HabitSummaryProps) {
  const days = [];
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  for (let i = 0; i < 7; i++) {
    const habitDate = currentDate.subtract({ days: 6 - i });
    const habitDay = habitDate.day.toString();
    const isCompleted = completions.some((c) => c.targetDate.equals(habitDate));
    days.push(
      <div
        className="day-track flex flex-col items-center gap-1"
        key={habitDate.toString()}
      >
        <div
          className={clsx(
            "habit-circle",
            "rounded-full",
            "border-2",
            "hover:cursor-pointer",
            isCompleted && "bg-white",
            isCompleted && "hover:bg-black",
            !isCompleted && "hover:bg-white",
          )}
        ></div>
        <span>{habitDay}</span>
      </div>,
    );
  }
  return (
    <section className="flex outline p-4 border-2 rounded-md items-start justify-between">
      <h1 className="text-xl mr-8 self-start">{title}</h1>
      <div className="flex">
        <div className="days flex flex-wrap gap-4">{days}</div>
        <button className="habit-completion-button flex justify-center items-center border-2 rounded-md ml-8 cursor-pointer hover:bg-white hover:text-black">
          <Check />
        </button>
      </div>
    </section>
  );
}
