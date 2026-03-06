import { Router } from 'express'
import * as todosService from './todos.service.js'
import {
	createTodoSchema,
	updateTodoSchema,
	listTodosQuerySchema,
	idParamSchema,
} from './todos.schemas.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../middleware/async-handler.js'

export const todosRouter = Router()

// GET /api/todos?page=1&limit=20&completed=true&search=milk&sort=newest
todosRouter.get(
	'/',
	validate(listTodosQuerySchema, 'query'),
	asyncHandler(async (req, res) => {
  		const result = await todosService.listTodos(res.locals.query)

  		res.set('X-Total-Count', String(result.meta.total))
  		res.json(result)
	})
)

// GET /api/todos/:id
todosRouter.get(
	'/:id',
	validate(idParamSchema, 'params'),
	asyncHandler(async (req, res) => {
		const todo = await todosService.getTodoById(res.locals.params.id)

		if (!todo) {
			return res.status(404).json({
		  		error: { code: 'NOT_FOUND', message: 'Todo not found' },
			})
		}

		res.json(todo)
	})
)

// POST /api/todos
todosRouter.post(
	'/',
	validate(createTodoSchema),
	asyncHandler(async (req, res) => {
  		const todo = await todosService.createTodo(res.locals.body)
  		res.status(201).json(todo)
	})
)

// PATCH /api/todos/:id
todosRouter.patch(
	'/:id',
	validate(idParamSchema, 'params'),
	validate(updateTodoSchema),
	asyncHandler(async (req, res) => {
  		const todo = await todosService.updateTodo(res.locals.params.id, res.locals.body)

  		if (!todo) {
    		return res.status(404).json({
      			error: { code: 'NOT_FOUND', message: 'Todo not found' },
    		})
  		}

  		res.json(todo)
	})
)

// DELETE /api/todos/:id
todosRouter.delete(
	'/:id',
	validate(idParamSchema, 'params'),
	asyncHandler(async (req, res) => {
  		const deleted = await todosService.deleteTodo(res.locals.params.id)

  		if (!deleted) {
    		return res.status(404).json({
      			error: { code: 'NOT_FOUND', message: 'Todo not found' },
    		})
  		}

  		res.status(204).send()
	})
)
