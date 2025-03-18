import prisma from "../../lib/prisma.js";

export const findAllBlogCats = async (skip, limit, where, orderBy) => {
    try {
        const datas = await prisma.blogCategory.findMany({
            skip,
            take: limit,
            where,
            orderBy,
        });
        const total = await prisma.blogCategory.count({ where });
        return { datas, total };
    } catch (error) {
        console.log(error);
        throw new Error("Kesalahan mengambil seluruh data blog category");
    }
};

export const findBlogCatByName = async (name) => {
    try {
        const data = await prisma.blogCategory.findUnique({
            where: { name }
        });
        return data;
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil data berdasarkan nama");
    }
}

export const findBlogCatById = async (id, whereCat) => {
    try {
        const data = await prisma.blogCategory.findUnique({
            where: { id },
            include:{
                blogs:true
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching Category by ID:", error);
        throw new Error("Kesalahan mengambil data berdasarkan ID");
    }
};

export const findBlogCatBySlug = async (slug, whereCat) => {
    try {
        const data = await prisma.blogCategory.findUnique({
            where: { slug },
        });
        return data;
    } catch (error) {
        console.error("Error fetching Category by Slug:", error);
        throw new Error("Kesalahan mengambil data berdasarkan Slug");
    }
};


export const insertBlogCat = async (data) => {
    try {
        await prisma.blogCategory.create({
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penambahan blog category");
    }
};

export const deleteBlogCat = async (id) => {
    try {
        await prisma.blogCategory.delete({
            where: { id },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penghapusan Blog category");
    }
};

export const editBlogCat = async (id, data) => {
    try {
        await prisma.blogCategory.update({
            where: { id },
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam mengubah Blog category");
    }
};