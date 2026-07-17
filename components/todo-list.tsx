import { Todo } from "@/lib/definitions";
import TodoItem from "@/components/todo-item";

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  return (
    <section className="border-4 rounded-md p-2 flex flex-col">
      <h1 className="text-2xl">Todo List</h1>
      <div className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
      </div>
    </section>
  );
}
