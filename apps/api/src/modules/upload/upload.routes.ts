import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'
import type multer from 'multer'
import { imageUpload, videoUpload } from './upload.config'
import { uploadController }         from './upload.controller'
import { authenticate }             from '../../middleware/authenticate'
import { ValidationError }          from '../../shared/errors/AppError'

const router = Router()

function makeHandler(instance: ReturnType<typeof multer>, sizeErrorMessage: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    instance.single('file')(req, res, (err: unknown) => {
      if (err instanceof MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? sizeErrorMessage : err.message
        next(new ValidationError(message))
        return
      }
      if (err) { next(err); return }
      uploadController.handle(req, res, next)
    })
  }
}

router.post('/',      authenticate, makeHandler(imageUpload, 'File must be under 5MB'))
router.post('/video', authenticate, makeHandler(videoUpload, 'Video must be under 500MB'))

export { router as uploadRouter }
