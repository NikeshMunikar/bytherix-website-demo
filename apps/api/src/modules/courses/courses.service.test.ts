import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFindBySlugAny, mockCreate, mockFindById, mockUpdate, mockSoftDelete } = vi.hoisted(() => ({
  mockFindBySlugAny: vi.fn(),
  mockCreate: vi.fn(),
  mockFindById: vi.fn(),
  mockUpdate: vi.fn(),
  mockSoftDelete: vi.fn(),
}))

vi.mock('./courses.repository', () => ({
  CoursesRepository: vi.fn().mockImplementation(() => ({
    findPublished:    vi.fn(),
    findAllForAdmin:  vi.fn(),
    findBySlug:       vi.fn(),
    findBySlugAny:    mockFindBySlugAny,
    findById:         mockFindById,
    create:           mockCreate,
    update:           mockUpdate,
    softDelete:       mockSoftDelete,
  })),
}))

import { coursesService } from './courses.service'

beforeEach(() => {
  mockFindBySlugAny.mockReset()
  mockCreate.mockReset()
  mockFindById.mockReset()
  mockUpdate.mockReset()
  mockSoftDelete.mockReset()
})

describe('CoursesService.create — slug generation and uniqueness', () => {
  it('derives a URL-safe slug from the title when no slug is given', async () => {
    mockFindBySlugAny.mockResolvedValue(null)
    mockCreate.mockResolvedValue({ _id: 'c1' })

    await coursesService.create({ title: 'Intro to TypeScript & Node.js!' }, 'instructor1')

    expect(mockFindBySlugAny).toHaveBeenCalledWith('intro-to-typescript-node-js')
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ slug: 'intro-to-typescript-node-js' }))
  })

  it('normalizes an explicitly provided slug the same way', async () => {
    mockFindBySlugAny.mockResolvedValue(null)
    mockCreate.mockResolvedValue({ _id: 'c1' })

    await coursesService.create({ title: 'Anything', slug: 'My Custom Slug!!' }, 'instructor1')

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ slug: 'my-custom-slug' }))
  })

  it('rejects creation when the slug is already taken', async () => {
    mockFindBySlugAny.mockResolvedValue({ _id: 'existing' })
    await expect(coursesService.create({ title: 'Duplicate Title' }, 'instructor1'))
      .rejects.toThrow('A course with this slug already exists')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('attributes the course to the given instructor', async () => {
    mockFindBySlugAny.mockResolvedValue(null)
    mockCreate.mockResolvedValue({ _id: 'c1' })
    await coursesService.create({ title: 'Some Course' }, 'instructor-42')
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ instructor: 'instructor-42' }))
  })
})

describe('CoursesService.update', () => {
  it('throws NotFoundError for a missing course', async () => {
    mockFindById.mockResolvedValue(null)
    await expect(coursesService.update('missing', { title: 'X' })).rejects.toThrow('Course not found')
  })

  it('leaves the slug untouched when neither slug nor title changes', async () => {
    mockFindById.mockResolvedValue({ _id: 'c1', slug: 'existing-slug' })
    mockUpdate.mockResolvedValue({ _id: 'c1' })
    await coursesService.update('c1', { price: 500 })
    expect(mockFindBySlugAny).not.toHaveBeenCalled()
    expect(mockUpdate).toHaveBeenCalledWith('c1', { price: 500 })
  })

  it('re-slugifies and checks uniqueness when the title changes the derived slug', async () => {
    mockFindById.mockResolvedValue({ _id: 'c1', slug: 'old-title' })
    mockFindBySlugAny.mockResolvedValue(null)
    mockUpdate.mockResolvedValue({ _id: 'c1' })

    await coursesService.update('c1', { title: 'Brand New Title' })

    expect(mockFindBySlugAny).toHaveBeenCalledWith('brand-new-title')
    expect(mockUpdate).toHaveBeenCalledWith('c1', expect.objectContaining({ slug: 'brand-new-title' }))
  })

  it('rejects the update if the new slug collides with a different course', async () => {
    mockFindById.mockResolvedValue({ _id: 'c1', slug: 'old-title' })
    mockFindBySlugAny.mockResolvedValue({ _id: 'some-other-course' })

    await expect(coursesService.update('c1', { title: 'Taken Title' }))
      .rejects.toThrow('A course with this slug already exists')
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})

describe('CoursesService.remove', () => {
  it('throws NotFoundError for a missing course', async () => {
    mockFindById.mockResolvedValue(null)
    await expect(coursesService.remove('missing')).rejects.toThrow('Course not found')
    expect(mockSoftDelete).not.toHaveBeenCalled()
  })

  it('soft-deletes an existing course', async () => {
    mockFindById.mockResolvedValue({ _id: 'c1' })
    await coursesService.remove('c1')
    expect(mockSoftDelete).toHaveBeenCalledWith('c1')
  })
})
