import prisma from "../../lib/prisma.js";

export const findAllServiceCats = async (skip, limit, where, orderBy) => {
    try {
        const datas = await prisma.categoryService.findMany({
            skip: skip,
            take: limit,
            orderBy,
            where
        });
        const total = await prisma.categoryService.count({ where });
        return { datas, total };
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil seluruh data category services");
    }
}

export const findServiceCatByName = async (name) => {
    try {
        const data = await prisma.categoryService.findUnique({
            where: { name }
        });
        return data;
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil data berdasarkan nama");
    }
}
export const findServiceCatById = async (id) => {
    try {
        const data = await prisma.categoryService.findUnique({
            where: { id },
            include: {
                plans: {
                    include: {
                        prices: true, // Mengambil semua data harga
                        benefits: true, // Mengambil semua data benefit
                    }
                }
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching Category by ID:", error);
        throw new Error("Kesalahan mengambil data berdasarkan ID");
    }
};

export const findServiceCatBySlug = async (slug, whereCat) => {
    try {
        const data = await prisma.categoryService.findUnique({
            where: { slug },
            include: {
                plans: {
                    where : whereCat, 
                    include: {
                        prices: true, // Mengambil semua data harga
                        benefits: true, // Mengambil semua data benefit
                    }
                }
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching Category by Slug:", error);
        throw new Error("Kesalahan mengambil data berdasarkan Slug");
    }
};


export const insertServiceCat = async (data) => {
    try {
        const datas = await prisma.categoryService.create({
            data
        });
        return datas
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penambahan service category");
    }
};

export const deleteServiceCat = async (id) => {
    try {
        await prisma.categoryService.delete({
            where: { id },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penghapusan service category");
    }
};

export const editServiceCat = async (id, data) => {
    try {
        await prisma.categoryService.update({
            where: { id },
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam mengubah service category");
    }
};