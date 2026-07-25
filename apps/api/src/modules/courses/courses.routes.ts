import { Router }            from 'express'
import { coursesController } from './courses.controller'
import { validate }          from '../../middleware/validate'
import { authenticate }      from '../../middleware/authenticate'
import { authorize }         from '../../middleware/authorize'
import {
  listCoursesSchema, slugParamSchema, idParamSchema, createCourseSchema, updateCourseSchema,
} from './courses.schema'

const router = Router()

router.get('/',            validate(listCoursesSchema), coursesController.list)
router.get('/admin/list',  authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(listCoursesSchema), coursesController.listAdmin)
router.get('/admin/:id',   authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(idParamSchema),     coursesController.getByIdAdmin)
router.get('/:slug',       validate(slugParamSchema),   coursesController.getBySlug)

router.post('/',     authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(createCourseSchema), coursesController.create)
router.put('/:id',   authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(updateCourseSchema), coursesController.update)
router.delete('/:id',authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(idParamSchema),      coursesController.remove)

export { router as coursesRouter }
