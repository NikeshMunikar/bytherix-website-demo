import multer      from 'multer'
import crypto      from 'crypto'
import path        from 'path'
import fs           from 'fs'
import os           from 'os'
import { ValidationError } from '../../shared/errors/AppError'

// Writable regardless of the container's read_only root filesystem — /tmp is
// tmpfs-mounted in docker-compose. NOTE: this is ephemeral storage (cleared on
// container restart). For durable storage, point this at a mounted volume or
// swap the multer storage engine for an S3/R2-backed one — the route contract
// (POST /api/v1/upload -> { url }) stays the same either way.
export const uploadsDir = path.join(os.tmpdir(), 'bytherix-uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '')
    cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new ValidationError('Only JPEG, PNG, WebP and GIF images are allowed'))
      return
    }
    cb(null, true)
  },
})
