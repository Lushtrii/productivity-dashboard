"use client";
import { Todo } from "@/lib/definitions";
import TodoItem from "@/components/todo-item";
import { useState } from "react";
import { deleteTodo, updateTodoCompletion } from "@/lib/data";
import { Plus } from "lucide-react";

interface TodoListProps {
  currentDateStr: string;
  todoStrs: string[];
}

function convertStrsToTodos(todoStrs: string[]): Todo[] {
  return todoStrs.map((todo) => {
    const todoObj = JSON.parse(todo);
    return {
      ...todoObj,
      dueDate:
        todoObj.dueDate !== null
          ? Temporal.PlainDate.from(todoObj.dueDate)
          : null,
      dueTime:
        todoObj.dueTime !== null
          ? Temporal.PlainTime.from(todoObj.dueTime)
          : null,
      completionTime:
        todoObj.completionTime !== null
          ? Temporal.Instant.from(todoObj.completionTime)
              .toZonedDateTimeISO(Temporal.Now.timeZoneId())
              .toPlainDateTime()
          : null,
    };
  });
}

export default function TodoList({ currentDateStr, todoStrs }: TodoListProps) {
  async function handleCompletionToggle(ind: number) {
    const nextTodos = todos.slice();
    nextTodos[ind].isComplete = !nextTodos[ind].isComplete;
    const completionTimeStr = await updateTodoCompletion(
      nextTodos[ind].id,
      nextTodos[ind].isComplete,
    );
    nextTodos[ind].completionTime =
      completionTimeStr !== null
        ? Temporal.PlainDateTime.from(JSON.parse(completionTimeStr))
        : completionTimeStr;
    nextTodos.sort((a, b) => {
      if (a.isComplete && !b.isComplete) return -1;
      if (!a.isComplete && b.isComplete) return 1;
      if (!a.isComplete && !b.isComplete) return a.id.localeCompare(b.id);
      if (a.completionTime === null || b.completionTime === null) {
        throw new Error("Completion times are unexpectedly null");
      } else {
        return Temporal.PlainDateTime.compare(
          a.completionTime,
          b.completionTime,
        );
      }
    });
    setTodos(nextTodos);
  }

  function handleDeletion(ind: number) {
    const nextTodos = todos.slice();
    const deletedTodo = nextTodos.splice(ind, 1)[0];
    setTodos(nextTodos);
    deleteTodo(deletedTodo.id);
  }

  const [todos, setTodos] = useState(convertStrsToTodos(todoStrs));
  const currentDate = Temporal.PlainDate.from(currentDateStr);
  return (
    <section className="row-span-2 h-full border-4 rounded-md p-2 flex flex-col">
      <h1 className="text-2xl">Todo List</h1>
      <div className="flex flex-col gap-4">
        {todos.map((todo, i) => (
          <TodoItem
            currentDate={currentDate}
            todo={todo}
            key={todo.id}
            handleCompletionToggle={() => handleCompletionToggle(i)}
            handleDeletion={() => handleDeletion(i)}
          />
        ))}
      </div>
      <button className="flex mt-4 justify-center p-3 border-3 rounded-md hover:cursor-pointer hover:text-black hover:bg-white">
        <div className="w-8 h-8 flex items-center justify-center rounded-full border-3">
          <Plus />
        </div>
      </button>
    </section>
  );
}
