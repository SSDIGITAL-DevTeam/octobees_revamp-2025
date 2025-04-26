import { and, asc, desc, eq, gte, like, or } from 'drizzle-orm'
import {
    findAllBlogCats,
    findBlogCatByName,
    findBlogCatById,
    insertBlogCat,
    deleteBlogCat,
    editBlogCat,
    findBlogCatBySlug,
} from './blog-category.repository.js'
import { blogCategory } from '../../drizzle/schema.js'
import dayjs from 'dayjs'

export const getAllBlogCat = async (filters) => {
    try {
        let { page = 1, limit = 10, status, search, orderBy, createdAt } = filters

        limit = Math.max(parseInt(limit) || 10, 1)
        const skip = (page - 1) * limit

        const whereConditions = []

        if (status !== undefined)
            whereConditions.push(
                eq(
                    blogCategory.status,
                    typeof status === 'boolean' ? status : status === 'true'
                )
            )
        if (search) {
            const keyword = `%${search.toLowerCase()}%`
            const searchFilters = [
                like(blogCategory.name, keyword),
                like(blogCategory.status, keyword),
            ]
            whereConditions.push(or(...searchFilters))
        }
        if (createdAt) {
            let dateFrom;
            const now = dayjs();

            switch (createdAt) {
                case 'today':
                    dateFrom = now.startOf('day').toDate();
                    break;
                case 'week':
                    dateFrom = now.startOf('week').toDate();
                    break;
                case 'month':
                    dateFrom = now.startOf('month').toDate();
                    break;
                case 'year':
                    dateFrom = now.startOf('year').toDate();
                    break;
                default:
                    dateFrom = null;
            }

            if (dateFrom) {
                whereConditions.push(gte(blogCategory.createdAt, dateFrom));
            }
        }

        const where = whereConditions.length
            ? and(...whereConditions)
            : undefined

        const order = (orderBy || []).map((item) => {
            const field = Object.keys(item)[0]
            const direction = item[field]
            return direction === 'desc'
                ? desc(blogCategory[field])
                : asc(blogCategory[field])
        })

        const { datas, total } = await findAllBlogCats(
            skip,
            limit,
            where,
            order
        )

        const totalPages = Math.ceil(total / limit)
        return {
            data: datas,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

// export const getBlogCatByTitle = async (name) => {
//     try {
//         const data =
//             (await findBlogCatByName(name)) || (await findBlogCatBySlug(name))
//         return data
//     } catch (error) {
//         throw new Error(error.message)
//     }
// }

export const getBlogCatById = async (id, filters) => {
    try {
        const { status } = filters
        const whereConditions = []

        if (status !== undefined)
            whereConditions.push(
                eq(
                    blogCategory.status,
                    typeof status === 'boolean' ? status : status === 'true'
                )
            )

        whereConditions.push(
            eq(blogCategory.id, id)
        )

        const where = whereConditions.length
            ? and(...whereConditions)
            : undefined

        let data = await findBlogCatById(where)
        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

export const createBlogCat = async (payload) => {
    
    try {
        const checkName = await findBlogCatByName(payload.name);
        // console.log(checkName)
        
        if (checkName.length > 0) {
          throw new Error("Category with this name already exists");
        }
        
        const slug = payload.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            
        let newStatus = payload.status
        if(typeof newStatus === 'string') {
            newStatus = newStatus === 'true'
        }
        const data = await insertBlogCat({ ...payload, slug, status: newStatus })
        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

export const deleteBlogCatById = async (id) => {
    try {
        await findBlogCatById(id)
        await deleteBlogCat(id)
    } catch (error) {
        throw new Error(error.message)
    }
}

export const updateBlogCat = async (id, payload) => {
    try {
        const data = await findBlogCatById(id)
        if (!data) {
            throw new Error('Blog Category is not found')
        }
        const newSlug = payload.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        await editBlogCat(id, { ...payload, slug: newSlug })
    } catch (error) {
        throw new Error(error.message)
    }
}
