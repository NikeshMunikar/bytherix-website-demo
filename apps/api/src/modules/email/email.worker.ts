import { Worker, type Job } from 'bullmq'
import nodemailer            from 'nodemailer'
import { emailConnectionOptions } from './email.connection'
import { renderEmail }       from './email.templates'
import { config }            from '../../config'
import { logger }            from '../../config/logger'
import type { EmailJobData } from './email.types'

const transporter = nodemailer.createTransport({
  host:   config.SMTP_HOST,
  port:   config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth:   config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined,
})

let worker: Worker<EmailJobData> | null = null

export function startEmailWorker(): Worker<EmailJobData> {
  if (worker) return worker

  worker = new Worker<EmailJobData>(
    'email',
    async (job: Job<EmailJobData>) => {
      const { subject, html } = renderEmail(job.data)

      if (!config.SMTP_USER) {
        logger.warn({ to: job.data.to, type: job.data.type }, 'SMTP not configured — email not sent (dev mode)')
        return
      }

      await transporter.sendMail({ from: config.SMTP_FROM, to: job.data.to, subject, html })
    },
    { connection: emailConnectionOptions, concurrency: 5 },
  )

  worker.on('completed', (job) => logger.info({ jobId: job.id, type: job.data.type, to: job.data.to }, 'Email job completed'))
  worker.on('failed',    (job, err) => logger.error({ jobId: job?.id, err }, 'Email job failed'))

  return worker
}

export async function stopEmailWorker(): Promise<void> {
  if (worker) {
    await worker.close()
    worker = null
  }
}
