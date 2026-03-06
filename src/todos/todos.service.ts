import { db } from '../db/index.js'
import { todos } from '../db/schema.js'
import { eq, like, and, desc, asc, sql } from 'drizzle-orm'
import { NotFoundError } from '../errors.js'

// Типы (выводятся из схемы)
type Todo = typeof todos.$inferSelect
type NewTodo = typeof todos.$inferInsert

// Параметры для списка
interface ListParams {
  page: number
  limit: number
  completed?: boolean
  search?: string
  sort: 'newest' | 'oldest'
}

export async function listTodos(params: ListParams) {
	const { page, limit, completed, search, sort } = params
  	const offset = (page - 1) * limit

  	// Собираем условия фильтрации
	const conditions = []
	if (completed !== undefined) {
		conditions.push(eq(todos.completed, completed))
	}
	if (search) {
		conditions.push(like(todos.title, `%${search}%`))
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined

	// Запрос данных
  	const data = await db
	    .select()
	    .from(todos)
	    .where(where)
	    .orderBy(sort === 'newest' ? desc(todos.createdAt) : asc(todos.createdAt))
	    .limit(limit)
	    .offset(offset)

	// Общее количество (для пагинации)
  	const [{ count }] = await db
	    .select({ count: sql<number>`count(*)` })
	    .from(todos)
	    .where(where)

	return {
		data,
		meta: {
		  page,
		  limit,
		  total: count,
		  totalPages: Math.ceil(count / limit),
		},
	}
}

export async function getTodoById(id: number): Promise<Todo | undefined> {
  const todo = db.select().from(todos).where(eq(todos.id, id)).get()

  if (!todo) {
  	throw new NotFoundError('Todo')
  }

  return todo
}

export async function createTodo(input: { title: string }): Promise<Todo> {
  const [todo] = await db
    .insert(todos)
    .values({ title: input.title })
    .returning()
  return todo
}

export async function updateTodo(
  id: number,
  input: { title?: string; completed?: boolean },
): Promise<Todo | undefined> {
  const [updated] = await db
    .update(todos)
    .set({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(todos.id, id))
    .returning()

   if (!updated) {
     throw new NotFoundError('Todo')
   }

  return updated
}

export async function deleteTodo(id: number): Promise<Todo | undefined> {
  const [deleted] = await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning()
  return deleted
}
