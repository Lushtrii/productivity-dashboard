"use client";
import { Check } from "lucide-react";
import clsx from "clsx";
import { HabitCompletion } from "@/lib/definitions";
import { useState, useRef } from "react";
import { addHabitCompletion, deleteHabitCompletion } from "@/lib/data";
import { useDebouncedCallback } from "use-debounce";

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
  const completionSummaries = useRef(
    generateCompletionSummary(
      Temporal.PlainDate.from(currentDateStr),
      previousCompletions,
    ),
  );
  const hasStateChanged = useRef(false);
  const [completionToggles, setCompletionToggles] = useState(
    generateCompletionSummary(
      Temporal.PlainDate.from(currentDateStr),
      previousCompletions,
    ).map((summary) => summary !== null),
  );
  const updateCompletions = useDebouncedCallback(
    async (habitId, summaryInd, targetDate) => {
      if (!hasStateChanged.current) return;

      if (completionSummaries.current[summaryInd] === null) {
        const id = await addHabitCompletion(habitId, targetDate.toString());
        completionSummaries.current[summaryInd] = { id, targetDate };
      } else {
        await deleteHabitCompletion(completionSummaries.current[summaryInd].id);
      }
      hasStateChanged.current = false;
    },
    750,
  );

  async function handleCompletionClick(
    habitId: string,
    summaryInd: number,
    targetDate: Temporal.PlainDate,
  ) {
    hasStateChanged.current = !hasStateChanged.current;
    const nextCompletionToggles = [...completionToggles];
    nextCompletionToggles[summaryInd] = !nextCompletionToggles[summaryInd];
    setCompletionToggles(nextCompletionToggles);
    updateCompletions(habitId, summaryInd, targetDate);
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
          {completionToggles.map((isCompleted, i) => {
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
        <button
          className={clsx(
            "habit-completion-button",
            "shrink-0",
            "flex",
            "justify-center",
            "items-center",
            "border-2",
            "rounded-md",
            "ml-8",
            "cursor-pointer",
            completionToggles.at(-1)
              ? ["bg-white", "text-black", "hover:bg-black", "hover:text-white"]
              : ["hover:bg-white", "hover:text-black"],
          )}
          onClick={() =>
            handleCompletionClick(
              habitId,
              completionToggles.length - 1,
              currentDate,
            )
          }
        >
          <Check />
        </button>
      </div>
    </section>
  );
}
