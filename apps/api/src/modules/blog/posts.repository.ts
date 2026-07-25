import type { FilterQuery } from 'mongoose'
import { Post, type IPost } from './post.model'

export interface PostListFilters {
  q?:    string
  tag?:  string
  page:  number
  limit: number
}

export class PostsRepository {
  async findPublished(filters: PostListFilters) {
    const query: FilterQuery<IPost> = { isPublished: true }
    if (filters.tag) query.tags = filters.tag
    if (filters.q)   query.$text = { $search: filters.q }

    const skip = (filters.page - 1) * filters.limit
    const [posts, total] = await Promise.all([
      Post.find(query).sort({ publishedAt: -1 }).skip(skip).limit(filters.limit)
        .populate('author', 'firstName lastName avatar').lean(),
      Post.countDocuments(query),
    ])

    return { posts, total, page: filters.page, limit: filters.limit, pages: Math.max(Math.ceil(total / filters.limit), 1) }
  }

  async findAllForAdmin(filters: { page: number; limit: number }) {
    const skip = (filters.page - 1) * filters.limit
    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(filters.limit)
        .populate('author', 'firstName lastName avatar').lean(),
      Post.countDocuments(),
    ])
    return { posts, total, page: filters.page, limit: filters.limit, pages: Math.max(Math.ceil(total / filters.limit), 1) }
  }

  findBySlug(slug: string) {
    return Post.findOne({ slug: slug.toLowerCase(), isPublished: true }).populate('author', 'firstName lastName avatar')
  }

  findBySlugAny(slug: string) {
    return Post.findOne({ slug: slug.toLowerCase() })
  }

  findById(id: string) {
    return Post.findById(id)
  }

  create(data: Partial<IPost>) {
    return Post.create(data)
  }

  update(id: string, data: Partial<IPost>) {
    return Post.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  softDelete(id: string) {
    return Post.findByIdAndUpdate(id, { deletedAt: new Date(), isPublished: false }, { new: true })
  }
}
