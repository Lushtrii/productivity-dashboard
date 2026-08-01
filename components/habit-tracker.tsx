"use client";
import HabitSummary from "@/components/habit-summary";
import HabitCreation from "@/components/habit-creation";
import { addHabit } from "@/lib/data";
import { HabitResult } from "@/lib/definitions";
import { Plus } from "lucide-react";
import { useState } from "react";
import { uuidv7 } from "uuidv7";

interface HabitTrackerProps {
  currentDateStr: string;
  habitStrs: string[];
  demoModeEnabled: boolean;
}

function convertStrsToHabits(habitStrs: string[]): HabitResult[] {
  return habitStrs.map((habit) => {
    const habitObj = JSON.parse(habit);
    const completions = habitObj.completions.map(
      (completion: { id: string; targetDate: string }) => {
        return {
          id: completion.id,
          targetDate: Temporal.PlainDate.from(completion.targetDate),
        };
      },
    );
    return {
      ...habitObj,
      completions,
    };
  });
}

export default function HabitTracker({
  currentDateStr,
  habitStrs,
  demoModeEnabled,
}: HabitTrackerProps) {
  function handleCreation(nextState: boolean) {
    setActiveCreation(nextState);
  }

  async function handleAddHabit(habitTitle: string) {
    if (habitTitle === "") return;

    let habitId = uuidv7();
    if (!demoModeEnabled) {
      habitId = await addHabit(habitTitle);
    }
    const habit: HabitResult = {
      id: habitId,
      title: habitTitle,
      completions: [],
    };
    setHabits([...habits, habit]);
    setActiveCreation(false);
  }

  const [habits, setHabits] = useState(convertStrsToHabits(habitStrs));
  const [activeCreation, setActiveCreation] = useState(false);
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  return (
    <div className="w-full p-2 h-full flex flex-col gap-4 border-3 rounded-2xl">
      <h1 className="text-2xl">Habit Tracker</h1>
      {habits.map((habit) => {
        const { id: habitId, title: habitTitle } = habit;
        return (
          <HabitSummary
            currentDateStr={currentDate.toString()}
            habitId={habitId}
            title={habitTitle}
            previousCompletions={habit.completions.map((completion) =>
              JSON.stringify(completion),
            )}
            key={habitId}
            demoModeEnabled={demoModeEnabled}
          />
        );
      })}
      {activeCreation ? (
        <HabitCreation
          handleAddHabit={handleAddHabit}
          handleCreation={handleCreation}
        />
      ) : (
        <button
          className="flex justify-center p-3 border-3 rounded-md hover:cursor-pointer hover:text-black hover:bg-white"
          onClick={() => handleCreation(true)}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full border-3">
            <Plus />
          </div>
        </button>
      )}
    </div>
  );
}
