import type { Request, Response, NextFunction } from 'express'
import { contactService }                         from './contact.service'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const contactController = {
  submit: wrap(async (req, res) => {
    await contactService.submit(req.body)
    res.status(201).json({ success: true, message: "Message sent. We'll get back to you within 24 hours." })
  }),
}
