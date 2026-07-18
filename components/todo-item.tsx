import { Check, Trash } from "lucide-react";
import { Todo } from "@/lib/definitions";

interface TodoItemProps {
  currentDate: Temporal.PlainDate;
  todo: Todo;
}

function formatDueDateStr(
  currentDate: Temporal.PlainDate,
  dueDate: Temporal.PlainDate,
): string {
  const yesterday = currentDate.subtract({ days: 1 });
  const tomorrow = currentDate.add({ days: 1 });

  if (dueDate.equals(yesterday)) {
    return "Yesterday";
  } else if (dueDate.equals(currentDate)) {
    return "Today";
  } else if (dueDate.equals(tomorrow)) {
    return "Tomorrow";
  } else {
    return dueDate.toString();
  }
}

export default function TodoItem({ currentDate, todo }: TodoItemProps) {
  return (
    <div className="flex justify-between border-2 rounded-md">
      <span>{todo.title}</span>
      <div className="w-64 flex gap-2 justify-around">
        <div className="flex flex-col">
          {todo.dueDate ? (
            <span>{formatDueDateStr(currentDate, todo.dueDate)}</span>
          ) : null}
          {todo.dueTime ? <span>{todo.dueTime.toString()}</span> : null}
        </div>
        <button>
          <Check />
        </button>
        <button>
          <Trash />
        </button>
      </div>
    </div>
  );
}
