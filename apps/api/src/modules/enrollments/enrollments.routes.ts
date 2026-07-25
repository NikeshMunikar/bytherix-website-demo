import { Router }               from 'express'
import { enrollmentsController } from './enrollments.controller'
import { validate }              from '../../middleware/validate'
import { authenticate }          from '../../middleware/authenticate'
import {
  createEnrollmentSchema, enrollmentIdParamSchema, updateProgressSchema,
} from './enrollments.schema'

const router = Router()

router.use(authenticate)

router.post('/',               validate(createEnrollmentSchema),  enrollmentsController.create)
router.get('/me',                                                 enrollmentsController.listMine)
router.get('/:id/progress',    validate(enrollmentIdParamSchema), enrollmentsController.getProgress)
router.put('/:id/progress',    validate(updateProgressSchema),    enrollmentsController.updateProgress)

export { router as enrollmentsRouter }
