import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFindByCourse, mockFindById, mockEnrollmentFindOne } = vi.hoisted(() => ({
  mockFindByCourse: vi.fn(),
  mockFindById: vi.fn(),
  mockEnrollmentFindOne: vi.fn(),
}))

vi.mock('./lessons.repository', () => ({
  LessonsRepository: vi.fn().mockImplementation(() => ({
    findByCourse:  mockFindByCourse,
    findById:      mockFindById,
    create:        vi.fn(),
    update:        vi.fn(),
    delete:        vi.fn(),
    reorder:       vi.fn(),
    countByCourse: vi.fn(),
  })),
}))

vi.mock('../enrollments/enrollment.model', () => ({
  Enrollment: { findOne: mockEnrollmentFindOne },
}))

import { lessonsService } from './lessons.service'

const baseLesson = {
  _id: 'lesson1', course: 'course1', title: 'Intro', description: 'desc',
  order: 0, durationMins: 10, videoSource: 'youtube' as const, videoUrl: 'https://youtube.com/watch?v=abc',
  isPreview: false, createdAt: new Date(), updatedAt: new Date(),
}

beforeEach(() => {
  mockFindByCourse.mockReset()
  mockFindById.mockReset()
  mockEnrollmentFindOne.mockReset()
})

describe('LessonsService.listForCourse access gating', () => {
  it('hides the video URL from an anonymous visitor on a non-preview lesson', async () => {
    mockFindByCourse.mockResolvedValue([baseLesson])
    mockEnrollmentFindOne.mockResolvedValue(null)

    const result = await lessonsService.listForCourse('course1', undefined, undefined)

    expect(result[0]!.locked).toBe(true)
    expect(result[0]).not.toHaveProperty('videoUrl')
  })

  it('exposes the video URL for a preview lesson regardless of enrollment', async () => {
    mockFindByCourse.mockResolvedValue([{ ...baseLesson, isPreview: true }])
    mockEnrollmentFindOne.mockResolvedValue(null)

    const result = await lessonsService.listForCourse('course1', undefined, undefined)

    expect(result[0]!.locked).toBe(false)
    expect(result[0]!.videoUrl).toBe(baseLesson.videoUrl)
  })

  it('exposes the video URL to an enrolled user on a non-preview lesson', async () => {
    mockFindByCourse.mockResolvedValue([baseLesson])
    mockEnrollmentFindOne.mockResolvedValue({ _id: 'enrollment1' })

    const result = await lessonsService.listForCourse('course1', 'user1', 'USER')

    expect(result[0]!.locked).toBe(false)
    expect(result[0]!.videoUrl).toBe(baseLesson.videoUrl)
    expect(mockEnrollmentFindOne).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'user1', course: 'course1' }),
    )
  })

  it('hides the video URL from a logged-in user who is not enrolled', async () => {
    mockFindByCourse.mockResolvedValue([baseLesson])
    mockEnrollmentFindOne.mockResolvedValue(null)

    const result = await lessonsService.listForCourse('course1', 'user1', 'USER')

    expect(result[0]!.locked).toBe(true)
    expect(result[0]).not.toHaveProperty('videoUrl')
  })

  it('exposes the video URL to staff without checking enrollment at all', async () => {
    mockFindByCourse.mockResolvedValue([baseLesson])

    const result = await lessonsService.listForCourse('course1', 'admin1', 'ADMIN')

    expect(result[0]!.locked).toBe(false)
    expect(mockEnrollmentFindOne).not.toHaveBeenCalled()
  })

  it('treats a CANCELLED enrollment as not enrolled', async () => {
    mockFindByCourse.mockResolvedValue([baseLesson])
    // The service queries with status: { $ne: 'CANCELLED' } — simulate that
    // filter actually excluding a cancelled enrollment by returning null.
    mockEnrollmentFindOne.mockResolvedValue(null)

    const result = await lessonsService.listForCourse('course1', 'user1', 'USER')

    expect(result[0]!.locked).toBe(true)
  })
})

describe('LessonsService.getById', () => {
  it('throws NotFoundError when the lesson does not exist', async () => {
    mockFindById.mockResolvedValue(null)
    await expect(lessonsService.getById('missing', undefined, undefined)).rejects.toThrow('Lesson not found')
  })

  it('locks a non-preview lesson for an anonymous request', async () => {
    mockFindById.mockResolvedValue(baseLesson)
    mockEnrollmentFindOne.mockResolvedValue(null)

    const result = await lessonsService.getById('lesson1', undefined, undefined)

    expect(result.locked).toBe(true)
    expect(result).not.toHaveProperty('videoUrl')
  })

  it('unlocks a non-preview lesson for the enrolled owner', async () => {
    mockFindById.mockResolvedValue(baseLesson)
    mockEnrollmentFindOne.mockResolvedValue({ _id: 'enrollment1' })

    const result = await lessonsService.getById('lesson1', 'user1', 'USER')

    expect(result.locked).toBe(false)
    expect(result.videoUrl).toBe(baseLesson.videoUrl)
  })
})
