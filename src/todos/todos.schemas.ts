import { z } from 'zod'

export const createTodoSchema = z.object({
	title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long')
})

export const updateTodoSchema = z.object({
	title: z.string().trim().min(1).max(200).optional(),
	completed: z.boolean().optional(),
}).refine(
	(data) => data.title !== undefined || data.completed !== undefined,
	{ message: 'At least one field must be provided' }
)

export const listTodosQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	completed: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
	search: z.string().max(100).optional(),
	sort: z.enum(['newest', 'oldest']).default('newest'),
})

export const idParamSchema = z.object({
	id: z.coerce.number().int().positive()
})


export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoIpunt = z.infer<typeof updateTodoSchema>
export type ListTodosQuery = z.infer<typeof listTodosQuerySchema>