import { Check } from "lucide-react";
export default function HabitSummary() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="day-track flex flex-col items-center gap-1">
        <div className="habit-circle rounded-full border-2 hover:bg-white hover:cursor-pointer"></div>
        <span className="num">{i}</span>
      </div>,
    );
  }
  return (
    <div className="flex w-fit outline p-4 border-2 rounded-md items-start">
      <p className="text-xl mr-8 self-start">Sleep for 8 hours</p>
      <div className="days flex gap-4">{days}</div>
      <button className="habit-completion-button flex justify-center items-center border-2 rounded-md ml-8 cursor-pointer hover:bg-white hover:text-black">
        <Check />
      </button>
    </div>
  );
}
