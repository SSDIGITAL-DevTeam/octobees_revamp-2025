import prisma from "../../lib/prisma.js";

export const findAllPages = async (skip, limit) => {
  try {
    const datas = await prisma.pages.findMany({
      skip: skip,
      take: limit,
      include: {
        meta: true,
      },
    });
    const total = await prisma.pages.count();
    return { datas, total };
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil seluruh data pages");
  }
};
export const findServiceCatById = async (slug) => {
  try {
    const datas = await prisma.pages.findUnique({
      where: { slug },
    });
    return datas;
  } catch (error) {
    console.error("Error fetching metaTag by ID:", error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};
