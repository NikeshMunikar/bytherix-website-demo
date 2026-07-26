import { Router }               from 'express'
import { lessonsController }    from './lessons.controller'
import { validate }             from '../../middleware/validate'
import { authenticate, authenticateOptional } from '../../middleware/authenticate'
import { authorize }            from '../../middleware/authorize'
import {
  courseIdParamSchema, lessonIdParamSchema, createLessonSchema, updateLessonSchema, reorderLessonsSchema,
} from './lessons.schema'

const router = Router()

router.get('/course/:courseId', authenticateOptional, validate(courseIdParamSchema), lessonsController.listForCourse)
router.get('/:id',               authenticateOptional, validate(lessonIdParamSchema), lessonsController.getById)

router.post('/',          authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(createLessonSchema),  lessonsController.create)
router.put('/reorder',    authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(reorderLessonsSchema), lessonsController.reorder)
router.put('/:id',        authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(updateLessonSchema),  lessonsController.update)
router.delete('/:id',     authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(lessonIdParamSchema), lessonsController.remove)

export { router as lessonsRouter }
