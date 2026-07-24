"use client";
import { Todo } from "@/lib/definitions";
import { Calendar, Clock, CircleAlert } from "lucide-react";
import { useState } from "react";

interface TodoCreationProps {
  handleCreation: (nextState: boolean) => void;
  handleAddTodo: (todo: Todo) => void;
}

export default function TodoCreation({
  handleCreation,
  handleAddTodo,
}: TodoCreationProps) {
  const [todoState, setTodoState] = useState<Todo>({
    id: "",
    title: "",
    dueDate: null,
    dueTime: null,
    priorityLevel: null,
    isComplete: false,
    completionTime: null,
  });
  return (
    <div className="min-w-max min-h-max flex flex-col items-start gap-4 border-3 rounded-md p-8 pr-4 pb-4">
      <input
        type="text"
        className="self-stretch border-b-2 text-xl max-w-xl"
        onChange={(e) => {
          const nextState = {
            ...todoState,
            title: e.target.value,
          };
          setTodoState(nextState);
        }}
        placeholder="Task name"
      />
      <div className="flex self-stretch justify-between items-end xl:items-center">
        <div className="flex flex-col gap-4 items-start xl:flex-row">
          <div className="w-50 p-2 rounded-sm flex items-center gap-2">
            <Calendar />
            <input
              id="todo-due-date"
              className="border-2 rounded-sm p-2"
              aria-label="Date"
              type="date"
              onChange={(e) => {
                const nextState = {
                  ...todoState,
                  dueDate: e.target.value
                    ? Temporal.PlainDate.from(e.target.value)
                    : null,
                };
                setTodoState(nextState);
              }}
            />
          </div>
          <div className="w-40 p-2 rounded-sm flex items-center gap-2">
            <Clock />
            <input
              id="todo-due-time"
              className="border-2 rounded-sm p-2 w-28"
              aria-label="Time"
              type="time"
              onChange={(e) => {
                const nextState = {
                  ...todoState,
                  dueTime: e.target.value
                    ? Temporal.PlainTime.from(e.target.value)
                    : null,
                };
                setTodoState(nextState);
              }}
            />
          </div>
          <div className="w-50 h-15 p-2 rounded-sm flex justify-start items-center gap-2">
            <CircleAlert />
            <select
              name="priority"
              id="priority-list"
              defaultValue="5"
              onChange={(e) => {
                const nextState = {
                  ...todoState,
                  priorityLevel: e.target.value ? +e.target.value : null,
                };
                setTodoState(nextState);
              }}
              className="border-2 rounded-sm p-2"
            >
              <option value="5"></option>
              <option value="1">Critical</option>
              <option value="2">High</option>
              <option value="3">Medium</option>
              <option value="4">Low</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6 justify-center">
          <button
            className="shrink-0 p-2 border-2 border-white rounded-sm bg-white text-black hover:cursor-pointer hover:bg-black hover:text-white"
            onClick={() => handleAddTodo(todoState)}
          >
            Add task
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
