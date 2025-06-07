import { findPageBySlug } from "../page/page.repository.js";
import {
  findAllMetaTags,
  findMetaById,
  insertMeta,
  deleteMeta,
  editMeta,
} from "./meta.repository.js";

export const getAllMetas = async (filters) => {
  try {
    const { page, limit, slug, search, orderBy } = filters;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        ...(slug ? [{ slug }] : []),
        {
          OR: [
            { key: { contains: search } },
            { value: { contains: search } },
            { content: { contains: search } },
          ],
        },
      ],
    };
    const { datas, total } = await findAllMetaTags(
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

export const getMetaById = async (id, filters) => {
  try {
    const { page, limit, orderBy, search } = filters;
    const skip = (page - 1) * limit;
    const where = {
      OR: [
        { key: { contains: search } },
        { value: { contains: search } },
        { content: { contains: search } },
      ],
    };
    const data =
      (await findMetaById(id, skip, limit, where, orderBy)) 
      //|| (await findMetaBySlug(id, skip, limit, where, orderBy));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createMeta = async (payload) => {
  try {
    const validPage = await findPageBySlug(payload.page);
    if (!validPage) {
      throw new Error("Page tidak ditemukan");
    }
    // console.log(payload);
    // console.log(validPage);
    const data = await insertMeta({ ...payload, slug: validPage.slug });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeMeta = async (id) => {
  try {
    await findMetaById(id);
    await deleteMeta(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateMeta = async (id, payload) => {
  try {
    const data = await findMetaById(id);
    if (!data) {
      throw new Error("Meta dengan Id tersebut tidak ditemukan");
    }
    await editMeta(id, payload);
  } catch (error) {
    throw new Error(error.message);
  }
};
