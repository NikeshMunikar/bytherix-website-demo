import { Router }          from 'express'
import { userController }  from './user.controller'
import { validate }        from '../../middleware/validate'
import { authenticate }    from '../../middleware/authenticate'
import { authorize }       from '../../middleware/authorize'
import { updateMeSchema, listUsersSchema, userIdParamSchema, updateUserRoleSchema } from './user.schema'

const router = Router()

router.get('/me', authenticate,                          userController.me)
router.put('/me', authenticate, validate(updateMeSchema), userController.updateMe)

router.get('/',        authenticate, authorize('ADMIN', 'SUPER_ADMIN'),  validate(listUsersSchema),      userController.list)
router.put('/:id/role',authenticate, authorize('SUPER_ADMIN'),           validate(updateUserRoleSchema), userController.updateRole)
router.delete('/:id',  authenticate, authorize('ADMIN', 'SUPER_ADMIN'),  validate(userIdParamSchema),    userController.remove)

export { router as usersRouter }
