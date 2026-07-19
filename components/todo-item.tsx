import { Check, Trash, Undo } from "lucide-react";
import clsx from "clsx";
import { Todo } from "@/lib/definitions";

interface TodoItemProps {
  currentDate: Temporal.PlainDate;
  todo: Todo;
  handleCompletionToggle: () => void;
  handleDeletion: () => void;
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

export default function TodoItem({
  currentDate,
  todo,
  handleCompletionToggle,
  handleDeletion,
}: TodoItemProps) {
  return (
    <div className="flex justify-between border-2 rounded-md">
      <span className={clsx(todo.isComplete && "line-through")}>
        {todo.title}
      </span>
      <div className="w-64 flex gap-2 justify-around">
        <div
          className={clsx(
            "flex",
            "flex-col",
            todo.isComplete && "line-through",
          )}
        >
          {todo.dueDate ? (
            <span>{formatDueDateStr(currentDate, todo.dueDate)}</span>
          ) : null}
          {todo.dueTime ? <span>{todo.dueTime.toString()}</span> : null}
        </div>
        <button
          className="hover:cursor-pointer"
          onClick={handleCompletionToggle}
        >
          {todo.isComplete ? <Undo /> : <Check />}
        </button>
        <button className="hover:cursor-pointer" onClick={handleDeletion}>
          <Trash />
        </button>
      </div>
    </div>
  );
}
