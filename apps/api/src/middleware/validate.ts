import type { Request, Response, NextFunction } from 'express'
import { type AnyZodObject, ZodError }           from 'zod'
import { ValidationError }                        from '../shared/errors/AppError'

interface Schema {
  body?:   AnyZodObject
  params?: AnyZodObject
  query?:  AnyZodObject
}

export function validate(schema: Schema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.body)   req.body   = await schema.body.parseAsync(req.body)
      if (schema.params) req.params = await schema.params.parseAsync(req.params)
      if (schema.query)  req.query  = await schema.query.parseAsync(req.query)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        next(new ValidationError(msg))
      } else {
        next(err)
      }
    }
  }
}