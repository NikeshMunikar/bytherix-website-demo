import multer      from 'multer'
import crypto      from 'crypto'
import path        from 'path'
import fs           from 'fs'
import { config }   from '../../config'
import { ValidationError } from '../../shared/errors/AppError'

// Disk-backed and persistent (see docker-compose.yml's uploads_data volume,
// mounted at UPLOAD_DIR). Deliberately NOT os.tmpdir()/tmpfs — tmpfs is
// RAM-backed, and a handful of video uploads would risk exceeding the API
// container's memory limit long before disk space would ever be a concern.
export const uploadsDir = path.resolve(config.UPLOAD_DIR)
fs.mkdirSync(uploadsDir, { recursive: true })

function makeStorage() {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '')
      cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`)
    },
  })
}

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export const imageUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: IMAGE_MAX_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(new ValidationError('Only JPEG, PNG, WebP and GIF images are allowed'))
      return
    }
    cb(null, true)
  },
})

// Kept as an alias so existing imports of `upload` (images) keep working.
export const upload = imageUpload

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const VIDEO_MAX_SIZE_BYTES = 500 * 1024 * 1024 // 500MB

// NOTE on scale: this works because storage is now disk-backed (see above),
// but self-hosting video at real scale (many large files, global delivery,
// re-encoding for adaptive bitrate) is genuinely better served by an object
// store + CDN (e.g. S3/R2 + CloudFront/Cloudflare) than by serving raw files
// off this API server's disk. This implementation is a legitimate, working
// path for a smaller catalog — treat YouTube/Vimeo embeds (already supported
// by the lesson videoSource field) as the lower-effort default, and revisit
// this if/when video volume grows.
export const videoUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: VIDEO_MAX_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!VIDEO_MIME_TYPES.includes(file.mimetype)) {
      cb(new ValidationError('Only MP4, WebM and QuickTime video files are allowed'))
      return
    }
    cb(null, true)
  },
})
