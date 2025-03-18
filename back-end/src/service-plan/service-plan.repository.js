import prisma from "../../lib/prisma.js";

export const findAllServicePlans = async (skip, limit, order, where) => {
  try {
    const datas = await prisma.planService.findMany({
      skip: skip,
      take: limit,
      orderBy: order,
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        prices: true, 
        benefits: {
          select: {
            value: true,
          },
        }, 
      },
    });
    const total = await prisma.planService.count({ where });
    return {datas, total};
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil seluruh data plan servis");
  }
};

export const findServiceCatByName = async (name) => {
  try {
    const data = await prisma.planService.findFirst({
      where: { name },
      include: {
        prices: true, // Mengambil semua data harga
        benefits: {
          select: {
            value: true,
          },
        }, // Mengambil semua data benefit
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil data berdasarkan nama");
  }
};
export const findServiceCatById = async (id) => {
  try {
    const data = await prisma.planService.findUnique({
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
            value: true,
          },
        }, // Mengambil semua data benefit
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching planService by ID:", error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};

// export const insertServiceCat = async (data) => {
//     try {
//         await prisma.planService.create({
//             data
//         });
//     } catch (error) {
//         console.log(error)
//         throw new Error("Kesalahan dalam penambahan service plan");
//     }
// };

export const insertServiceCat = async (data) => {
  try {
    const { prices, benefits, ...planData } = data;
    await prisma.planService.create({
      data: {
        ...planData,
        prices: { create: prices },
        benefits: { create: benefits },
      },
      include: { prices: true, benefits: true },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam penambahan service plan");
  }
};

export const deleteServiceCat = async (id) => {
  try {
    await prisma.planService.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam penghapusan service plan");
  }
};

export const editServiceCat = async (id, data) => {
  try {
    const { prices, benefits, ...planData } = data;

    await prisma.planService.update({
      where: { id },
      data: {
        ...planData,

        // Hapus semua prices & tambahkan ulang
        prices: {
          deleteMany: {},
          create: prices,
        },

        // Hapus semua benefits & tambahkan ulang
        benefits: {
          deleteMany: {},
          create: benefits,
        },
      },
      include: { prices: true, benefits: true },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam mengubah service plan");
  }
};
