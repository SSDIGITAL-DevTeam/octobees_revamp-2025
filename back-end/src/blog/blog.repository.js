//berkomunikasi dengan database
//dapat menggunakan orm atau query raw
//supaya untuk mengganti ORM tinggal ganti pada file ini aja kok

import prisma from "../../lib/prisma.js";

export const findAllQueue = async (skip, limit, where, orderBy) => {
  try {
    const datas = await prisma.blog.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        category: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    const total = await prisma.blog.count({ where });
    return { datas, total };
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil semua antrean");
  }
};

export const findQueueById = async (id) => {
  try {
    const queue = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    return queue;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil antrean berdasarkan ID");
  }
};
export const latestQueue = async (payload) => {
  try {
    const { doctorId, date } = payload;
    const latestQueue = await prisma.queues.findFirst({
      where: {
        doctorId,
        date,
      },
      orderBy: {
        queueNumber: "desc",
      },
    });
    return latestQueue ? latestQueue.queueNumber + 1 : 1;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil antrean terbaru");
  }
};

export const insertQueue = async (data) => {
  try {
    await prisma.blog.create({ data });
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan menambahkan blog");
  }
};

export const deleteQueue = async (id) => {
  try {
    await prisma.blog.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan menghapus blog");
  }
};

export const editQueue = async (id, data) => {
  try {
    await prisma.blog.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengubah blog");
  }
};
