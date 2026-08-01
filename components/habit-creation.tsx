"use client";
import { useState } from "react";

interface HabitCreationProps {
  handleCreation: (nextState: boolean) => void;
  handleAddHabit: (habitTitle: string) => void;
}

export default function HabitCreation({
  handleCreation,
  handleAddHabit,
}: HabitCreationProps) {
  const [habitTitle, setHabitTitle] = useState("");
  return (
    <div className="min-w-max min-h-max flex flex-col items-start gap-8 border-3 rounded-md p-8 pr-4 pb-8">
      <input
        type="text"
        className="self-stretch border-b-2 text-xl max-w-xl"
        onChange={(e) => {
          setHabitTitle(e.target.value);
        }}
        placeholder="Habit name"
      />
      <div className="flex self-stretch justify-start items-end xl:items-center">
        <div className="flex gap-6 justify-center">
          <button
            className="shrink-0 p-2 border-2 border-white rounded-sm bg-white text-black hover:cursor-pointer hover:bg-black hover:text-white"
            onClick={() => handleAddHabit(habitTitle)}
          >
            Add habit
          </button>

          <button
            className="shrink-0 p-2 border-2 rounded-sm hover:cursor-pointer hover:bg-white hover:text-black hover:border-white"
            onClick={() => handleCreation(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
