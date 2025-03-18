//functionya re-usable

import {
  deleteQueue,
  editQueue,
  findAllQueue,
  findQueueById,
  insertQueue,
  latestQueue,
} from "./blog.repository.js";
import dayjs from "dayjs";
import "dayjs/locale/id.js";

dayjs.locale("id"); // Set locale ke bahasa Indonesia
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllQueue = async (filters) => {
  try {
    const { page, limit, status, orderBy, search, favorite, categoryId } =
      filters;
    const skip = (page - 1) * limit;
    const where = {
      AND: [
        ...(status ? [{ status }] : []),
        ...(categoryId ? [{ categoryId }] : []),
        ...(favorite ? [{ favorite : favorite === "true"}] : []),
        {
          OR: [
            { title: { contains: search } },
            ...(search && ["Draft", "Active", "NonActive"].includes(search)
              ? [{ status: search }]
              : []),
          ],
        },
      ],
    };
    const { datas, total } = await findAllQueue(
      skip,
      limit,
      where,
      orderBy
    );
    
    const totalPages = Math.ceil(total / limit);

    return {
      data: datas,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getQueueById = async (id) => {
  try {
    const queue = await findQueueById(id);
    if (!queue) {
      throw new Error("Blog dengan Id tersebut tidak ditemukan");
    }
    return queue;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createQueue = async (payload) => {
  try {
    // const category = await getQueueById(data.categoryId);
    // if (!category) throw new Error("Kategori tidak ditemukan");
    await insertQueue(payload);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteQueueById = async (id) => {
  try {
    // Ambil data blog berdasarkan ID
    const blog = await getQueueById(id);
    if (!blog) {
      throw new Error("Blog tidak ditemukan");
    }
    // Hapus gambar jika ada
    const imagePath = path.join(__dirname, "../../upload", blog.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await deleteQueue(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateQueue = async (id, payload) => {
  try {
    const queue = await findQueueById(id);
    if (!queue) {
      throw new Error("Blog dengan Id tersebut tidak ditemukan");
    }

    const { image, favorite } = payload;
    if (image) {
      const imagePath = path.join(__dirname, "../../upload", queue.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await editQueue(id, {...payload, favorite : (favorite === "true")});
  } catch (error) {
    throw new Error(error.message);
  }
};
