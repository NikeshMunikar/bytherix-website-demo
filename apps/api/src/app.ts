import express               from 'express'
import path                  from 'path'
import helmet                from 'helmet'
import cors                  from 'cors'
import cookieParser          from 'cookie-parser'
import mongoSanitize         from 'express-mongo-sanitize'
import hpp                   from 'hpp'
import pinoHttp              from 'pino-http'
import * as Sentry           from '@sentry/node'
import { config }            from './config'
import { logger }            from './config/logger'
import { correlationId }     from './middleware/correlationId'
import { errorHandler }      from './middleware/errorHandler'
import { generalLimiter }    from './middleware/rateLimiter'
import { authRouter }        from './modules/auth/auth.routes'
import { coursesRouter }     from './modules/courses/courses.routes'
import { contactRouter }     from './modules/contact/contact.routes'
import { usersRouter }       from './modules/users/user.routes'
import { enrollmentsRouter } from './modules/enrollments/enrollments.routes'
import { adminRouter }       from './modules/admin/admin.routes'
import { uploadRouter }      from './modules/upload/upload.routes'
import { uploadsDir }        from './modules/upload/upload.config'
import { postsRouter }       from './modules/blog/posts.routes'

Sentry.init({
  ...(process.env.SENTRY_DSN && {
    dsn: process.env.SENTRY_DSN
  }),
  environment: process.env.NODE_ENV ?? "development"
});
export const app = express()

app.set('trust proxy', 1)
app.disable('x-powered-by')

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  hsts:               { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard:         { action: 'deny' },
  noSniff:            true,
  referrerPolicy:     { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
}))

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:       config.CLIENT_URL,
  credentials:  true,
  methods:      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
}))

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false, limit: '10kb' }))
app.use(cookieParser(config.COOKIE_SECRET))

// ── Sanitisation ──────────────────────────────────────────────────────────────
app.use(mongoSanitize())   // NoSQL injection
app.use(hpp())             // HTTP param pollution

// ── Observability ─────────────────────────────────────────────────────────────
app.use(correlationId)
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }))

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api', generalLimiter)

// ── Health checks ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok',    timestamp: new Date().toISOString() }))
app.get('/ready',  (_req, res) => res.json({ status: 'ready', timestamp: new Date().toISOString() }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',     authRouter)
app.use('/api/v1/courses',  coursesRouter)
app.use('/api/v1/contact',  contactRouter)
app.use('/api/v1/users',    usersRouter)
app.use('/api/v1/enrollments', enrollmentsRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1/posts', postsRouter)

// ── Uploaded files ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }))

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler)


