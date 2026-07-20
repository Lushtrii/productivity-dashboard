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
    <div className="flex h-12 items-center justify-between border-2 rounded-md">
      <span
        className={clsx("flex-1", "ml-2", todo.isComplete && "line-through")}
      >
        {todo.title}
      </span>
      <div className="w-80 mr-4 flex items-center justify-between">
        <span className="w-24">
          {todo.dueDate && formatDueDateStr(currentDate, todo.dueDate)}
        </span>
        <span className="w-24">{todo.dueTime && todo.dueTime.toString()}</span>
        <div className="flex gap-6">
          <button
            className="flex h-8 w-8 rounded-sm justify-center items-center hover:cursor-pointer hover:bg-white hover:text-black"
            onClick={handleCompletionToggle}
          >
            {todo.isComplete ? <Undo /> : <Check />}
          </button>
          <button
            className="h-8 w-8 flex justify-center items-center text-red-400 rounded-sm hover:cursor-pointer hover:bg-red-400 hover:text-black"
            onClick={handleDeletion}
          >
            <Trash />
          </button>
        </div>
      </div>
    </div>
  );
}
