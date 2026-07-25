import { PostsRepository, type PostListFilters } from './posts.repository'
import { NotFoundError, ConflictError }            from '../../shared/errors/AppError'
import type { IPost }                               from './post.model'

const repo = new PostsRepository()

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export class PostsService {
  list(filters: PostListFilters) {
    return repo.findPublished(filters)
  }

  listForAdmin(filters: { page: number; limit: number }) {
    return repo.findAllForAdmin(filters)
  }

  async getBySlug(slug: string) {
    const post = await repo.findBySlug(slug)
    if (!post) throw new NotFoundError('Post')
    return post
  }

  async getById(id: string) {
    const post = await repo.findById(id)
    if (!post) throw new NotFoundError('Post')
    return post
  }

  async create(data: Partial<IPost>, authorId: string) {
    const slug     = slugify(data.slug ?? data.title ?? '')
    const existing = await repo.findBySlugAny(slug)
    if (existing) throw new ConflictError('A post with this slug already exists')

    const readTimeMins = data.readTimeMins ?? estimateReadTime(data.content ?? '')

    return repo.create({
      ...data, slug, author: authorId as never, readTimeMins,
      ...(data.isPublished ? { publishedAt: new Date() } : {}),
    })
  }

  async update(id: string, data: Partial<IPost>) {
    const post = await repo.findById(id)
    if (!post) throw new NotFoundError('Post')

    if (data.slug || data.title) {
      const nextSlug = slugify(data.slug ?? data.title ?? post.slug)
      if (nextSlug !== post.slug) {
        const existing = await repo.findBySlugAny(nextSlug)
        if (existing) throw new ConflictError('A post with this slug already exists')
      }
      data.slug = nextSlug
    }

    if (data.content && !data.readTimeMins) data.readTimeMins = estimateReadTime(data.content)
    if (data.isPublished && !post.isPublished) data.publishedAt = new Date()

    return repo.update(id, data)
  }

  async remove(id: string): Promise<void> {
    const post = await repo.findById(id)
    if (!post) throw new NotFoundError('Post')
    await repo.softDelete(id)
  }
}

export const postsService = new PostsService()
