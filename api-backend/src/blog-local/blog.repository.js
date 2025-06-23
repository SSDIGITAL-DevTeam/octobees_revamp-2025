//berkomunikasi dengan database
//dapat menggunakan orm atau query raw
//supaya untuk mengganti ORM tinggal ganti pada file ini aja kok

import { db } from '../../drizzle/db.js'
import { blog, blogCategory, user } from '../../drizzle/schema.js'
import { eq, count } from 'drizzle-orm'
import logger from '../../utils/logger.js'

export const findAllBlogs = async (skip, limit, where, orderBy) => {
    try {
        let baseQuery = db
            .select({
                blog: blog,
                user: {
                    id: user.id,
                    name: user.name,
                },
                blogCategory: {
                    id: blogCategory.id,
                    name: blogCategory.name,
                    slug: blogCategory.slug,
                },
            })
            .from(blog)
            .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
            .leftJoin(user, eq(blog.userId, user.id))
        if (where) baseQuery = baseQuery.where(where)
        if (orderBy) baseQuery = baseQuery.orderBy(...orderBy)
          
        const datas = await baseQuery.limit(limit).offset(skip)
        
        const totalQuery = db
            .select({ count: count() })
            .from(blog)
            .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
            .leftJoin(user, eq(blog.userId, user.id))

        if (where) totalQuery.where(where)

        const [{ count: total }] = await totalQuery

        return { datas, total }
    } catch (error) {
        logger.error(`GET BLOG / error: ${error.message}`)
        throw new Error('Get All Blogs Unsuccessfully')
    }
}

export const findBlogById = async (blogId) => {
    try {
        const selectedBlog = await db
            .select({
                blog,
                user: {
                    id: user.id,
                    name: user.name,
                },
                blogCategory: {
                    id: blogCategory.id,
                    name: blogCategory.name,
                    slug: blogCategory.slug,
                },
            })
            .from(blog)
            .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
            .leftJoin(user, eq(blog.userId, user.id))
            .where(eq(blog.id, blogId))
            .limit(1)

        return selectedBlog[0] || null
    } catch (error) {
        logger.error(`GET BLOG /:ID error: ${error.message}`)
        throw new Error('Get blog by ID unsuccessfully')
    }
}
export const findBlogBySlug = async (slug) => {
    try {
        const selectedBlog = await db
            .select({
                blog,
                user: {
                    id: user.id,
                    name: user.name,
                },
                blogCategory: {
                    id: blogCategory.id,
                    name: blogCategory.name,
                    slug: blogCategory.slug,
                },
            })
            .from(blog)
            .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
            .leftJoin(user, eq(blog.userId, user.id))
            .where(eq(blog.slug, slug))
            .limit(1)

        return selectedBlog[0] || null
    } catch (error) {
        logger.error(`GET BLOG /:SLUG error: ${error.message}`)
        throw new Error('Get blog by slug unsuccessfully')
    }
}

export const findBlogByTitle = async (title) => {
    try {
        const result = await db
            .select()
            .from(blog)
            .where(eq(blog.title, title))
            .limit(1)

        return result[0] || null
    } catch (error) {
        logger.error(`GET BLOG /:TITLE error: ${error.message}`)
        throw new Error('Get blog by title unsuccessfully')
    }
}

export const insertBlog = async (data) => {
    try {
        await db.insert(blog).values(data)
    } catch (error) {
        logger.error(`POST BLOG / error: ${error.message}`)
        throw new Error('Insert blog unsuccessfully')
    }
}

export const deleteBlog = async (id) => {
    try {
        await db.delete(blog).where(eq(blog.id, id))
    } catch (error) {
        logger.error(`DELETE BLOG /:ID error: ${error.message}`)
        throw new Error('Delete blog unsuccessfully')
    }
}

export const editQueue = async (id, data) => {
    try {
        await db.update(blog).set(data).where(eq(blog.id, id))
    } catch (error) {
        logger.error(`UPDATE BLOG /:ID error: ${error.message}`)
        throw new Error('Update blog queue unsuccessfully')
    }
}
