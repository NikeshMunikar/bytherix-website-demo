import { Router }             from 'express'
import { paymentsController } from './payments.controller'
import { validate }           from '../../middleware/validate'
import { authenticate }       from '../../middleware/authenticate'
import { initiatePaymentSchema, verifyPaymentSchema, markFailedSchema } from './payments.schema'

const router = Router()

router.use(authenticate)

router.post('/esewa/initiate',    validate(initiatePaymentSchema), paymentsController.initiate)
router.post('/esewa/verify',      validate(verifyPaymentSchema),   paymentsController.verify)
router.post('/esewa/mark-failed', validate(markFailedSchema),      paymentsController.markFailed)
router.get('/me',                                                 paymentsController.listMine)

export { router as paymentsRouter }
