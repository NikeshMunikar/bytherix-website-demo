import { AuditLog, type IAuditLog } from './audit.model'
import { logger }                    from '../../config/logger'

export class AuditService {
  async log(data: Omit<IAuditLog, 'createdAt'>): Promise<void> {
    try { await AuditLog.create(data) }
    catch (err) { logger.error({ err }, 'Audit log write failed') }
  }
}

export const auditService = new AuditService()