//berkomunikasi dengan database
//dapat menggunakan orm atau query raw
//supaya untuk mengganti ORM tinggal ganti pada file ini aja kok

import { count, eq } from 'drizzle-orm'
import { db } from '../../drizzle/db.js'
import { user } from '../../drizzle/schema.js'

export const findAllUsers = async (skip, limit, where, orderBy) => {
    try {
        let baseQuery = db.select({ user }).from(user)
        // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
        // .leftJoin(user, eq(blog.userId, user.id))

        if (where) baseQuery = baseQuery.where(where)
        if (orderBy) baseQuery = baseQuery.orderBy(...orderBy)

        const datas = await baseQuery.limit(limit).offset(skip)

        const totalQuery = db.select({ count: count() }).from(user)
        // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
        // .leftJoin(user, eq(blog.userId, user.id))

        if (where) totalQuery.where(where)

        const [{ count: total }] = await totalQuery

        return { datas, total }
    } catch (error) {
        console.log('GET / error: ', error)
        throw new Error('Error fetching all users')
    }
}

export const findUserById = async (id) => {
    try {
        let baseQuery = db
            .select({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    status: user.status,
                    role: user.role,
                    features: user.features,
                },
            })
            .from(user)
            .where(eq(user.id, id))
        const data = await baseQuery.limit(1)

        return data
    } catch (error) {
        console.log('GET /Id error: ', error)
        throw new Error('Error fetching user by id')
    }
}

export const findUserByEmail = async (email) => {
    try {
        const selectedEmail = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                features: user.features,
            })
            .from(user)
            .where(eq(user.email, email))
            .limit(1)

        return selectedEmail[0] || null
    } catch (error) {
        console.error('GET by Email / error: ', error)
        throw new Error('Error fetching user by email')
    }
}

export const findUserByRefreshToken = async (refreshToken) => {
    try {
        const findRefreshToken = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                features: user.features,
            })
            .from(user)
            .where(eq(user.refreshToken, refreshToken))
            .limit(1)

        return findRefreshToken[0] || null
    } catch (error) {
        console.error('GET by Refresh Token / error: ', error)
        throw new Error('Error fetching user by refresh token')
    }
}

export const insertUser = async (data) => {
    try {
        await db.insert(user).values(data)
    } catch (error) {
        console.error('POST / error: ', error)
        throw new Error('Error creating user')
    }
}

export const deleteUser = async (id) => {
    try {
        await db.delete(user).where(eq(user.id, id))
    } catch (error) {
        console.log(error)
        throw new Error('Kesalahan dalam penghapusan role')
    }
}

export const editUser = async (id, data) => {
    try {
        await db.update(user).set(data).where(eq(user.id, id))
    } catch (error) {
        console.log(error)
        throw new Error('Edit user unsuccessfully')
    }
}
