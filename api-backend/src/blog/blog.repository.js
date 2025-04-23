//berkomunikasi dengan database
//dapat menggunakan orm atau query raw
//supaya untuk mengganti ORM tinggal ganti pada file ini aja kok

import { db } from '../../drizzle/db.js'
import { blog, blogCategory, user } from '../../drizzle/schema.js'
import { eq, count } from 'drizzle-orm'

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
            console.log("======================================")
        if (where) baseQuery = baseQuery.where(where)
        if (orderBy) baseQuery = baseQuery.orderBy(...orderBy)
          
        const datas = await baseQuery.limit(limit).offset(skip)
        
        console.log(datas)
        const totalQuery = db
            .select({ count: count() })
            .from(blog)
            .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
            .leftJoin(user, eq(blog.userId, user.id))

        if (where) totalQuery.where(where)

        const [{ count: total }] = await totalQuery

        return { datas, total }
    } catch (error) {
        console.log('GET / error: ', error)
        throw new Error('Error fetching all blogs')
    }
}

export const findBlogById = async (blogId) => {
    try {
        const selectedBlog = await db
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
            .where(eq(blog.id, blogId))
            .limit(1)

        return selectedBlog[0] || null
    } catch (error) {
        console.error('GET by ID / error: ', error)
        throw new Error('Error fetching blog by ID')
    }
}
export const findBlogBySlug = async (blogId) => {
    try {
        const selectedBlog = await db
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
            .where(eq(blog.slug, blogId))
            .limit(1)

        return selectedBlog[0] || null
    } catch (error) {
        console.error('GET by ID / error: ', error)
        throw new Error('Error fetching blog by ID')
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
        console.error('GET by Title / error: ', error)
        throw new Error('Error fetching blog by title')
    }
}

export const insertBlog = async (data) => {
    try {
        await db.insert(blog).values(data)
    } catch (error) {
        console.error('POST / error: ', error)
        throw new Error('Error inserting blog')
    }
}

export const deleteBlog = async (id) => {
    try {
        await db.delete(blog).where(eq(blog.id, id))
    } catch (error) {
        console.error('DELETE / error: ', error)
        throw new Error('Error deleting blog')
    }
}

export const editQueue = async (id, data) => {
    try {
        await db.update(blog).set(data).where(eq(blog.id, id))
    } catch (error) {
        console.log(error)
        throw new Error('Blog edit unsuccessfully')
    }
}
