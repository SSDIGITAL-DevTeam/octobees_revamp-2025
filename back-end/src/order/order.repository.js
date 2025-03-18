import prisma from "../../lib/prisma.js";

export const findAllServiceCats = async (skip, limit) => {
    try {
        const datas = await prisma.order.findMany({
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
                plan: {
                    select: {
                        name: true
                    }
                }, 
            }
        });
        return datas;
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil seluruh data plan servis");
    }
}


export const findServiceCatById = async (id) => {
    try {
        const data = await prisma.order.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
                prices: true, // Mengambil semua data harga
                benefits: {
                    select: {
                        value: true
                    }
                }, // Mengambil semua data benefit
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw new Error("Kesalahan mengambil data berdasarkan ID");
    }
};

export const insertServiceCat = async (data) => {
    try {
        await prisma.order.create({
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penambahan service plan");
    }
};


export const deleteServiceCat = async (id) => {
    try {
        await prisma.order.delete({
            where: { id },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penghapusan service plan");
    }
};

export const editServiceCat = async (id, data) => {
    try {
        await prisma.order.update({
            where: { id },
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam mengubah service plan");
    }
};