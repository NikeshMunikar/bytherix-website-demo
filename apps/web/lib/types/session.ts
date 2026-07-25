export interface Session {
  _id:               string
  userId:            string
  userAgent:         string
  ip:                string
  deviceFingerprint: string
  isRevoked:         boolean
  expiresAt:         string
  lastUsedAt:        string
  createdAt:         string
}
