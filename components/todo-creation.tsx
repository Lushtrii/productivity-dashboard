import { Calendar, Clock, CircleAlert } from "lucide-react";

interface TodoCreationProps {
  handleCreation: (nextState: boolean) => void;
}

export default function TodoCreation({ handleCreation }: TodoCreationProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 border-3 rounded-md h-48 p-8 pr-4 pb-4">
      <input
        type="text"
        className="w-xl border-b-2 text-xl"
        placeholder="Task name"
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="w-50 p-2 rounded-sm flex items-center gap-2">
            <Calendar />
            <input
              id="todo-due-date"
              className="border-2 rounded-sm p-2"
              aria-label="Date"
              type="date"
            />
          </div>
          <div className="w-40 p-2 rounded-sm flex items-center gap-2">
            <Clock />
            <input
              id="todo-due-time"
              className="border-2 rounded-sm p-2 w-28"
              aria-label="Time"
              type="time"
            />
          </div>
          <div className="w-50 p-2 rounded-sm flex justify-start items-center gap-2">
            <CircleAlert />
            <select
              name="priority"
              id="priority-list"
              defaultValue="5"
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
        <div className="flex gap-6 items-center justify-center">
          <button className="p-2 border-2 border-white rounded-sm bg-white text-black hover:cursor-pointer hover:bg-black hover:text-white">
            Add task
          </button>

          <button
            className="p-2 border-2 rounded-sm hover:cursor-pointer hover:bg-white hover:text-black hover:border-white"
            onClick={() => handleCreation(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
