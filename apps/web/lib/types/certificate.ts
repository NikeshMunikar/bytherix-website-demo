export interface Certificate {
  _id:               string
  certificateNumber: string
  user:              string
  course:            { _id: string; title: string; thumbnail?: string; duration: number }
  enrollment:        string
  issuedAt:          string
  createdAt:         string
}
