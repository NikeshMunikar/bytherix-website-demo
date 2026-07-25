export interface PostAuthor {
  _id:       string
  firstName: string
  lastName:  string
  avatar?:   string
}

export interface Post {
  _id:          string
  title:        string
  slug:         string
  excerpt:      string
  content:      string
  coverImage:   string
  author:       PostAuthor
  tags:         string[]
  readTimeMins: number
  isPublished:  boolean
  publishedAt?: string
  createdAt:    string
  updatedAt:    string
}

export interface PostFilters {
  q?:     string
  tag?:   string
  page?:  number
  limit?: number
}
