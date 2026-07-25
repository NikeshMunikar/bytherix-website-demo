import { Router }             from 'express'
import { contactController }  from './contact.controller'
import { validate }           from '../../middleware/validate'
import { contactLimiter }     from '../../middleware/rateLimiter'
import { submitContactSchema } from './contact.schema'

const router = Router()

router.post('/', contactLimiter, validate(submitContactSchema), contactController.submit)

export { router as contactRouter }
