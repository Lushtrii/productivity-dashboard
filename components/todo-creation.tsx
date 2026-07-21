import { Calendar, CircleAlert } from "lucide-react";

interface TodoCreationProps {
  handleCreation: (nextState: boolean) => void;
}

export default function TodoCreation({ handleCreation }: TodoCreationProps) {
  return (
    <div className="grid grid-cols-2 grid-rows-3 flex-col gap-6 border-3 rounded-md h-48 p-2 pb-4">
      <input
        type="text"
        className="col-span-2 w-lg border-b-2 text-xl"
        placeholder="Task name"
      />
      <div className="row-span-2">
        <div className="p-2 rounded-sm flex items-center gap-8">
          <Calendar />
          <input
            id="todo-due-datetime"
            className="border-2 rounded-sm p-2"
            aria-label="Date and time"
            type="datetime-local"
          />
        </div>

        <div className="p-2 rounded-sm flex justify-start items-center gap-8">
          <CircleAlert />
          <select
            name="priority"
            id="priority-list"
            className="border-2 rounded-sm p-2"
          >
            <option value="1">Critical</option>
            <option value="2">High</option>
            <option value="3">Medium</option>
            <option value="4">Low</option>
          </select>
        </div>
      </div>
      <div className="row-span-2 mr-4 flex gap-6 items-end justify-end">
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
  );
}
