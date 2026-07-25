import { Queue } from 'bullmq'
import { emailConnectionOptions } from './email.connection'
import type { EmailJobData } from './email.types'

export const emailQueue = new Queue<EmailJobData, void, EmailJobData['type']>('email', { connection: emailConnectionOptions })

export async function enqueueEmail(job: EmailJobData): Promise<void> {
  await emailQueue.add(job.type, job, {
    attempts:         3,
    backoff:          { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail:     500,
  })
}
