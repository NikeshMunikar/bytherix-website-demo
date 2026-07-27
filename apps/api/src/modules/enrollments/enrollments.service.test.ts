import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockFindByUserAndCourse, mockCreate, mockFindById, mockUpdate,
  mockCourseFindById, mockCourseFindByIdAndUpdate, mockIssueForEnrollmentIfEligible,
} = vi.hoisted(() => ({
  mockFindByUserAndCourse: vi.fn(),
  mockCreate: vi.fn(),
  mockFindById: vi.fn(),
  mockUpdate: vi.fn(),
  mockCourseFindById: vi.fn(),
  mockCourseFindByIdAndUpdate: vi.fn(),
  mockIssueForEnrollmentIfEligible: vi.fn(),
}))

vi.mock('./enrollments.repository', () => ({
  EnrollmentsRepository: vi.fn().mockImplementation(() => ({
    findByUserAndCourse: mockFindByUserAndCourse,
    create:              mockCreate,
    findById:             mockFindById,
    update:               mockUpdate,
    listForUser:          vi.fn(),
  })),
}))

vi.mock('../courses/course.model', () => ({
  Course: { findById: mockCourseFindById, findByIdAndUpdate: mockCourseFindByIdAndUpdate },
}))

vi.mock('../certificates/certificates.service', () => ({
  certificatesService: { issueForEnrollmentIfEligible: mockIssueForEnrollmentIfEligible },
}))

import { enrollmentsService } from './enrollments.service'

beforeEach(() => {
  mockFindByUserAndCourse.mockReset()
  mockCreate.mockReset()
  mockFindById.mockReset()
  mockUpdate.mockReset()
  mockCourseFindById.mockReset()
  mockCourseFindByIdAndUpdate.mockReset()
  mockIssueForEnrollmentIfEligible.mockReset()
})

describe('EnrollmentsService.enroll', () => {
  it('throws NotFoundError when the course does not exist', async () => {
    mockCourseFindById.mockResolvedValue(null)
    await expect(enrollmentsService.enroll('user1', 'course1')).rejects.toThrow('Course not found')
  })

  it('throws NotFoundError when the course exists but is unpublished', async () => {
    mockCourseFindById.mockResolvedValue({ isPublished: false })
    await expect(enrollmentsService.enroll('user1', 'course1')).rejects.toThrow('Course not found')
  })

  it('throws ConflictError when already enrolled', async () => {
    mockCourseFindById.mockResolvedValue({ isPublished: true })
    mockFindByUserAndCourse.mockResolvedValue({ _id: 'existing-enrollment' })
    await expect(enrollmentsService.enroll('user1', 'course1')).rejects.toThrow('Already enrolled in this course')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('creates the enrollment and increments the course enrollment count', async () => {
    mockCourseFindById.mockResolvedValue({ isPublished: true })
    mockFindByUserAndCourse.mockResolvedValue(null)
    mockCreate.mockResolvedValue({ _id: 'new-enrollment', user: 'user1', course: 'course1' })

    const result = await enrollmentsService.enroll('user1', 'course1')

    expect(result).toEqual({ _id: 'new-enrollment', user: 'user1', course: 'course1' })
    expect(mockCourseFindByIdAndUpdate).toHaveBeenCalledWith('course1', { $inc: { enrollmentCount: 1 } })
  })
})

describe('EnrollmentsService ownership checks', () => {
  const enrollment = { _id: 'e1', user: { toString: () => 'owner-id' }, progress: 0, completedLessons: [] }

  it('getProgress throws NotFoundError for a missing enrollment', async () => {
    mockFindById.mockResolvedValue(null)
    await expect(enrollmentsService.getProgress('missing', 'owner-id', 'USER')).rejects.toThrow('Enrollment not found')
  })

  it('getProgress throws ForbiddenError for a non-owner, non-staff requester', async () => {
    mockFindById.mockResolvedValue(enrollment)
    await expect(enrollmentsService.getProgress('e1', 'someone-else', 'USER')).rejects.toThrow()
  })

  it('getProgress succeeds for the owner', async () => {
    mockFindById.mockResolvedValue(enrollment)
    const result = await enrollmentsService.getProgress('e1', 'owner-id', 'USER')
    expect(result).toBe(enrollment)
  })

  it('getProgress succeeds for staff even when not the owner', async () => {
    mockFindById.mockResolvedValue(enrollment)
    const result = await enrollmentsService.getProgress('e1', 'admin-id', 'ADMIN')
    expect(result).toBe(enrollment)
  })
})

describe('EnrollmentsService.updateProgress completion handling', () => {
  const enrollment = { _id: 'e1', user: { toString: () => 'owner-id' }, progress: 50, completedLessons: [] }

  it('does not mark completed or issue a certificate below 100% progress', async () => {
    mockFindById.mockResolvedValue(enrollment)
    mockUpdate.mockResolvedValue({ ...enrollment, progress: 60, status: 'ACTIVE' })

    await enrollmentsService.updateProgress('e1', 'owner-id', 'USER', { progress: 60 })

    expect(mockUpdate).toHaveBeenCalledWith('e1', expect.objectContaining({ progress: 60 }))
    expect(mockUpdate.mock.calls[0][1]).not.toHaveProperty('status')
    expect(mockIssueForEnrollmentIfEligible).not.toHaveBeenCalled()
  })

  it('marks the enrollment COMPLETED and triggers certificate issuance at 100%', async () => {
    mockFindById.mockResolvedValue(enrollment)
    mockUpdate.mockResolvedValue({ ...enrollment, progress: 100, status: 'COMPLETED' })

    await enrollmentsService.updateProgress('e1', 'owner-id', 'USER', { progress: 100 })

    expect(mockUpdate).toHaveBeenCalledWith('e1', expect.objectContaining({ progress: 100, status: 'COMPLETED' }))
    expect(mockIssueForEnrollmentIfEligible).toHaveBeenCalledWith('e1')
  })

  it('rejects a non-owner, non-staff update attempt', async () => {
    mockFindById.mockResolvedValue(enrollment)
    await expect(
      enrollmentsService.updateProgress('e1', 'someone-else', 'USER', { progress: 100 }),
    ).rejects.toThrow()
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})
