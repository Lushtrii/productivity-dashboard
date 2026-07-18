import { Check } from "lucide-react";
import clsx from "clsx";
import { HabitCompletion } from "@/lib/definitions";

interface HabitSummaryProps {
  endDateStr: string;
  id: string;
  title: string;
<<<<<<< Updated upstream
  completions: HabitCompletion[];
=======
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
  endDate: Temporal.PlainDate,
  completionStrs: string[],
): HabitCompletion[] {
  const completions = parseCompletionStrs(completionStrs);
  const formattedCompletions = new Array(NUM_COMPLETIONS_TO_DISPLAY).fill(null);
  const startDate = endDate.subtract({
    days: NUM_COMPLETIONS_TO_DISPLAY - 1,
  });
  for (const completion of completions) {
    const index = startDate.until(completion.targetDate).days;
    formattedCompletions[index] = completion;
  }
  return formattedCompletions;
>>>>>>> Stashed changes
}

export default function HabitSummary({
  endDateStr,
  title,
  completions,
}: HabitSummaryProps) {
<<<<<<< Updated upstream
  const days = [];
  const today = Temporal.Now.plainDateISO();
  for (let i = 0; i < 7; i++) {
    const habitDate = today.subtract({ days: 6 - i });
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
=======
  const [completionSummary, setCompletionSummary] = useState(
    generateCompletionSummary(
      Temporal.PlainDate.from(endDateStr),
      previousCompletions,
    ),
  );

  const endDate = Temporal.PlainDate.from(endDateStr);
  function handleCompletionClick(completionSummaryInd: number) {
    if (completionSummary[completionSummaryInd] === null) {
      const targetDate = endDate.subtract({
        days: NUM_COMPLETIONS_TO_DISPLAY - 1 - completionSummaryInd,
      });
      console.log(targetDate.toString());
    }
  }
  const startDate = endDate.subtract({ days: NUM_COMPLETIONS_TO_DISPLAY - 1 });
>>>>>>> Stashed changes
  return (
    <section className="flex outline p-4 border-2 rounded-md items-start justify-between">
      <h1 className="text-xl mr-8 self-start">{title}</h1>
      <div className="flex">
<<<<<<< Updated upstream
        <div className="days flex flex-wrap gap-4">{days}</div>
=======
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
                  onClick={() => handleCompletionClick(i)}
                ></div>
                <span>{date.day}</span>
              </div>
            );
          })}
        </div>
>>>>>>> Stashed changes
        <button className="habit-completion-button flex justify-center items-center border-2 rounded-md ml-8 cursor-pointer hover:bg-white hover:text-black">
          <Check />
        </button>
      </div>
    </section>
  );
}
