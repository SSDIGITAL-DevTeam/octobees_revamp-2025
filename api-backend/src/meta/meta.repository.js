import prisma from "../../lib/prisma.js";

export const findAllServiceCats = async (skip, limit, where, orderBy) => {
    try {
        const datas = await prisma.metaTag.findMany({
            skip: skip,
            take: limit,
            where,
            orderBy,
            include : {
                pages : true
            }
        });
        const total = await prisma.metaTag.count({where});
        return { datas, total };
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil seluruh data meta");
    }
}

export const findPagesBySlug = async (slug, skip, limit, where, orderBy) => {
    try {
        const data = await prisma.pages.findUnique({
            where: { slug },
            include: {
                meta: true
                
            }
        });
        return data;
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil data berdasarkan page");
    }
}
export const findServiceCatById = async (id, skip, limit, where, orderBy) => {
    try {
        const data = await prisma.metaTag.findUnique({
            where: { id },
            include : {
                pages : true
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching metaTag by ID:", error);
        throw new Error("Kesalahan mengambil data berdasarkan ID");
    }
};

export const insertServiceCat = async (data) => {
    const {page, key, value, content} = data;
    try {
        await prisma.metaTag.create({
            data: {
                key,
                value,
                content,
                pages: {
                    connect: {
                        slug: page,
                    },
                },
            },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penambahan meta");
    }
};
export const insertPage = async (name, slug, id) => {
    try {
        await prisma.pages.create({
            data: {
                page: name,
                slug,
                categoryService: {
                  connect: { id }, 
                },
              },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penambahan meta");
    }
};

export const deleteServiceCat = async (id) => {
    try {
        await prisma.metaTag.delete({
            where: { id },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penghapusan meta");
    }
};

export const editServiceCat = async (id, data) => {
    try {
        await prisma.metaTag.update({
            where: { id },
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam mengubah meta");
    }
};