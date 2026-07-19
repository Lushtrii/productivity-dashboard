"use client";
import { Check } from "lucide-react";
import clsx from "clsx";
import { HabitCompletion } from "@/lib/definitions";
import { useState } from "react";
import { addHabitCompletion, deleteHabitCompletion } from "@/lib/data";

interface HabitSummaryProps {
  currentDateStr: string;
  habitId: string;
  title: string;
  previousCompletions: string[];
}

const NUM_COMPLETIONS_TO_DISPLAY = 7;

function parseCompletionStrs(completionStrs: string[]): HabitCompletion[] {
  return completionStrs.map((completionStr) => {
    const obj = JSON.parse(completionStr);
    return {
      id: obj.id,
      targetDate: Temporal.PlainDate.from(obj.targetDate),
    };
  });
}

function generateCompletionSummary(
  currentDate: Temporal.PlainDate,
  completionStrs: string[],
): (HabitCompletion | null)[] {
  const completions = parseCompletionStrs(completionStrs);
  const formattedCompletions: (HabitCompletion | null)[] = new Array(
    NUM_COMPLETIONS_TO_DISPLAY,
  ).fill(null);
  const startDate = currentDate.subtract({
    days: NUM_COMPLETIONS_TO_DISPLAY - 1,
  });
  for (const completion of completions) {
    const index = startDate.until(completion.targetDate).days;
    formattedCompletions[index] = completion;
  }
  return formattedCompletions;
}

export default function HabitSummary({
  currentDateStr,
  habitId,
  title,
  previousCompletions,
}: HabitSummaryProps) {
  const [completionSummary, setCompletionSummary] = useState(
    generateCompletionSummary(
      Temporal.PlainDate.from(currentDateStr),
      previousCompletions,
    ),
  );

  async function handleCompletionClick(
    habitId: string,
    summaryInd: number,
    targetDate: Temporal.PlainDate,
  ) {
    if (completionSummary[summaryInd] === null) {
      const id = await addHabitCompletion(habitId, targetDate.toString());
      const nextCompletionSummary = [...completionSummary];
      nextCompletionSummary[summaryInd] = { id, targetDate };
      setCompletionSummary(nextCompletionSummary);
    } else {
      await deleteHabitCompletion(completionSummary[summaryInd].id);
      const nextCompletionSummary = [...completionSummary];
      nextCompletionSummary[summaryInd] = null;
      setCompletionSummary(nextCompletionSummary);
    }
  }
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  const startDate = currentDate.subtract({
    days: NUM_COMPLETIONS_TO_DISPLAY - 1,
  });
  return (
    <section className="flex outline p-4 border-2 rounded-md items-start justify-between">
      <h1 className="text-xl mr-8 self-start">{title}</h1>
      <div className="flex">
        <div className="days flex flex-wrap gap-4">
          {completionSummary.map((completion, i) => {
            const isCompleted = completion !== null;
            const date = startDate.add({ days: i });
            return (
              <div
                className="day-track flex flex-col items-center gap-1"
                key={date.toString()}
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
                  onClick={() => handleCompletionClick(habitId, i, date)}
                ></div>
                <span>{date.day}</span>
              </div>
            );
          })}
        </div>
        <button className="habit-completion-button flex justify-center items-center border-2 rounded-md ml-8 cursor-pointer hover:bg-white hover:text-black">
          <Check />
        </button>
      </div>
    </section>
  );
}
