export type VideoSource = 'youtube' | 'vimeo' | 'upload' | 'external'

export interface Lesson {
  _id:          string
  course:       string
  title:        string
  description?: string
  order:        number
  durationMins: number
  videoSource:  VideoSource
  videoUrl?:    string // absent when locked
  isPreview:    boolean
  locked:       boolean
  createdAt:    string
  updatedAt:    string
}
