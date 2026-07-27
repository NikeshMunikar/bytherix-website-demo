import { Router }             from 'express'
import { paymentsController } from './payments.controller'
import { validate }           from '../../middleware/validate'
import { authenticate }       from '../../middleware/authenticate'
import { paymentLimiter }     from '../../middleware/rateLimiter'
import { initiatePaymentSchema, verifyPaymentSchema, markFailedSchema } from './payments.schema'

const router = Router()

router.use(authenticate)

router.post('/esewa/initiate',    paymentLimiter, validate(initiatePaymentSchema), paymentsController.initiate)
router.post('/esewa/verify',      paymentLimiter, validate(verifyPaymentSchema),   paymentsController.verify)
router.post('/esewa/mark-failed', paymentLimiter, validate(markFailedSchema),      paymentsController.markFailed)
router.get('/me',                                                                  paymentsController.listMine)

export { router as paymentsRouter }
