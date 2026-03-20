import { getTodos } from '@/utils/supabase/queries/todos'

export default async function Page() {
  const todos = await getTodos()

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  )
}
