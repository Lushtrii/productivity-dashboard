import { Check, Trash } from "lucide-react";
import { Todo } from "@/lib/definitions";

interface TodoItemProps {
  todo: Todo;
}

function formatDueDateStr(dueDate: Temporal.PlainDate): string {
  const today = Temporal.Now.plainDateISO();
  const yesterday = today.subtract({ days: 1 });
  const tomorrow = today.add({ days: 1 });

  if (dueDate.equals(yesterday)) {
    return "Yesterday";
  } else if (dueDate.equals(today)) {
    return "Today";
  } else if (dueDate.equals(tomorrow)) {
    return "Tomorrow";
  } else {
    return dueDate.toString();
  }
}

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="flex justify-between border-2 rounded-md">
      <span>{todo.title}</span>
      <div className="w-64 flex gap-2 justify-around">
        <div className="flex flex-col">
          {todo.dueDate ? <span>{formatDueDateStr(todo.dueDate)}</span> : null}
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
