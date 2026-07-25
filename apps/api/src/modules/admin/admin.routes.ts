import { Router }           from 'express'
import { adminController }  from './admin.controller'
import { validate }         from '../../middleware/validate'
import { authenticate }     from '../../middleware/authenticate'
import { authorize }        from '../../middleware/authorize'
import { listAuditLogsSchema, listSessionsSchema } from './admin.schema'

const router = Router()

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'))

router.get('/stats',       adminController.stats)
router.get('/audit-logs',  validate(listAuditLogsSchema), adminController.auditLogs)
router.get('/sessions',    validate(listSessionsSchema),  adminController.sessions)

export { router as adminRouter }
