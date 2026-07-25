import type { Request, Response, NextFunction } from 'express'
import { config }          from '../../config'
import { ValidationError } from '../../shared/errors/AppError'

export const uploadController = {
  handle: (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) throw new ValidationError('No file uploaded')
    const url = `${config.API_PUBLIC_URL}/uploads/${req.file.filename}`
    res.status(201).json({ success: true, data: { url, size: req.file.size, mimeType: req.file.mimetype } })
  },
}
