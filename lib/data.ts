import sql from "./db";

interface Todo {
  id: string;
  title: string;
  dueDate: string;
  createdAt: string;
  priorityLevel: number;
  isComplete: boolean;
  completionTime: string;
}

async function getAllTodos(): Promise<Todo[]> {
  const todos = await sql<Todo[]>`SELECT * FROM todo_item`;
  return todos;
}
