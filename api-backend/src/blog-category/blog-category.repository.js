import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { blog, blogCategory } from "../../drizzle/schema.js";

export const findAllBlogCats = async (skip, limit, where, orderBy) => {
    try {
            let baseQuery = db
                .select(
                    blogCategory,
                )
                .from(blogCategory)
                // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
                // .leftJoin(user, eq(blog.userId, user.id))
    
            if (where) baseQuery = baseQuery.where(where)
            if (orderBy) baseQuery = baseQuery.orderBy(...orderBy)
    
            const datas = await baseQuery.limit(limit).offset(skip)
    
            const totalQuery = db
                .select({ count: count() })
                .from(blogCategory)
                // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
                // .leftJoin(user, eq(blog.userId, user.id))
    
            if (where) totalQuery.where(where)
    
            const [{ count: total }] = await totalQuery
    
            return { datas, total }
        } catch (error) {
            console.log('GET / error: ', error)
            throw new Error('Error fetching all blog categories')
        }
};

export const findBlogCatByName = async (name) => {
    try {
        let baseQuery = db
            .select(
                blogCategory,
            )
            .from(blogCategory)
            .leftJoin(blog, eq(blog.categoryId, blogCategory.id))
            .where(eq(blogCategory.name, name))
            .limit(1)
        const datas = await baseQuery
        return datas
    } catch (error) {
        console.log('GET / error: ', error)
        throw new Error('Error fetching all blog categories by title')
    }
}

export const findBlogCatById = async (where) => {
    try {
        let baseQuery = db
            .select(
                blogCategory,
                // blog
            )
            .from(blogCategory)
            .leftJoin(blog, eq(blog.categoryId, blogCategory.id))

        if (where) baseQuery = baseQuery.where(where)
        const datas = await baseQuery.limit(1)
        return datas[0]
    } catch (error) {
        console.log('GET / error: ', error)
        throw new Error('Error fetching all blog categories')
    }
};

export const findBlogCatBySlug = async (where) => {
    try {
        let baseQuery = db
            .select({
                blogCategory,
                blog
            })
            .from(blogCategory)
            .leftJoin(blog, eq(blog.categoryId, blogCategory.id))
            // .leftJoin(user, eq(blog.userId, user.id))

        if (where) baseQuery = baseQuery.where(where)
        // if (orderBy) baseQuery = baseQuery.orderBy(...orderBy)

        const datas = await baseQuery
        // .limit(limit).offset(skip)

        // const totalQuery = db
        //     .select({ count: count() })
        //     .from(blogCategory)
        //     // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
        //     // .leftJoin(user, eq(blog.userId, user.id))

        // if (where) totalQuery.where(where)

        // const [{ count: total }] = await totalQuery

        // return { datas, total }
        return datas
    } catch (error) {
        console.log('GET / error: ', error)
        throw new Error('Error fetching all blog categories')
    }
};


export const insertBlogCat = async (data) => {
    try {
        
        // console.log("insertBlogCat data: ", data);

        await db.insert(blogCategory).values(data);
        
    } catch (error) {
        console.error('POST / error: ',error)
        throw new Error("Error inserting blog category");
    }
};

export const deleteBlogCat = async (id) => {
    try {
        await db.delete(blogCategory).where(eq(blogCategory.id, id))
    } catch (error) {
        console.log(error)
        throw new Error("Delete blog category unsuccessfully");
    }
};

export const editBlogCat = async (id, data) => {
    try {
       await db.update(blogCategory).set(data).where(eq(blogCategory.id, id))
    } catch (error) {
        console.log(error)
        throw new Error("Change blog category unsuccessfully");
    }
};