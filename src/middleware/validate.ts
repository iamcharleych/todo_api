import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

type RequestField = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, field: RequestField = 'body') {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[field])

		if (!result.success) {
			return res.status(400).json({
				error: {
					code: 'VALIDATION_ERROR',
					message: formatZodError(result.error),
					details: result.error.issues
				}
			})
		}

		// Store validated data where handlers can access it
		// req.query/params are read-only in Express 5, so use res.locals
		res.locals[field] = result.data
		next()
	}
}

function formatZodError(error: ZodError): string {
	return error.issues
		.map(issue => `${issue.path.join('.')}: ${issue.message}`)
		.join('; ')
}