import { Todo } from "@/lib/definitions";
import TodoItem from "@/components/todo-item";

interface TodoListProps {
  currentDate: Temporal.PlainDate;
  todos: Todo[];
}

export default function TodoList({ currentDate, todos }: TodoListProps) {
  return (
    <section className="row-span-2 h-full border-4 rounded-md p-2 flex flex-col">
      <h1 className="text-2xl">Todo List</h1>
      <div className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem currentDate={currentDate} todo={todo} key={todo.id} />
        ))}
      </div>
    </section>
  );
}
