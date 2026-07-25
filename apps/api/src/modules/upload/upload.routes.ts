import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'
import { upload }            from './upload.config'
import { uploadController }  from './upload.controller'
import { authenticate }      from '../../middleware/authenticate'
import { ValidationError }   from '../../shared/errors/AppError'

const router = Router()

function handleUpload(req: Request, res: Response, next: NextFunction) {
  upload.single('file')(req, res, (err: unknown) => {
    if (err instanceof MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'File must be under 5MB' : err.message
      next(new ValidationError(message))
      return
    }
    if (err) { next(err); return }
    uploadController.handle(req, res, next)
  })
}

router.post('/', authenticate, handleUpload)

export { router as uploadRouter }
