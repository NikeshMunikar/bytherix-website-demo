import { Router }                from 'express'
import { certificatesController } from './certificates.controller'
import { validate }              from '../../middleware/validate'
import { authenticate }          from '../../middleware/authenticate'
import { certificateIdParamSchema, certificateNumberParamSchema } from './certificates.schema'

const router = Router()

router.get('/verify/:certificateNumber', validate(certificateNumberParamSchema), certificatesController.verify)

router.get('/me',            authenticate,                                       certificatesController.listMine)
router.get('/:id/download',  authenticate, validate(certificateIdParamSchema),    certificatesController.download)

export { router as certificatesRouter }
