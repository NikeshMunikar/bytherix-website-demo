import { Router }           from 'express'
import { postsController }  from './posts.controller'
import { validate }         from '../../middleware/validate'
import { authenticate }     from '../../middleware/authenticate'
import { authorize }        from '../../middleware/authorize'
import {
  listPostsSchema, slugParamSchema, idParamSchema, createPostSchema, updatePostSchema,
} from './posts.schema'

const router = Router()

router.get('/',           validate(listPostsSchema), postsController.list)
router.get('/admin/list', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(listPostsSchema), postsController.listAdmin)
router.get('/admin/:id',  authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(idParamSchema),   postsController.getByIdAdmin)
router.get('/:slug',      validate(slugParamSchema), postsController.getBySlug)

router.post('/',      authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(createPostSchema), postsController.create)
router.put('/:id',    authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(updatePostSchema), postsController.update)
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(idParamSchema),    postsController.remove)

export { router as postsRouter }
