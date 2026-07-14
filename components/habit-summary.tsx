import { Check } from "lucide-react";

interface HabitSummaryProps {
  title: string;
}

export default function HabitSummary({ title }: HabitSummaryProps) {
  const days = [];
  const today = Temporal.Now.plainDateISO();
  for (let i = 0; i < 7; i++) {
    const habitDateStr = today.subtract({ days: 6 - i }).day.toString();
    days.push(
      <div
        className="day-track flex flex-col items-center gap-1"
        key={habitDateStr}
      >
        <div className="habit-circle rounded-full border-2 hover:bg-white hover:cursor-pointer"></div>
        <span>{habitDateStr}</span>
      </div>,
    );
  }
  return (
    <div className="flex w-fit outline p-4 border-2 rounded-md items-start">
      <p className="text-xl mr-8 self-start">{title}</p>
      <div className="days flex gap-4">{days}</div>
      <button className="habit-completion-button flex justify-center items-center border-2 rounded-md ml-8 cursor-pointer hover:bg-white hover:text-black">
        <Check />
      </button>
    </div>
  );
}
