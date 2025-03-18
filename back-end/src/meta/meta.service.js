import {
  findAllServiceCats,
  findServiceCatById,
  insertServiceCat,
  deleteServiceCat,
  editServiceCat,
  findPagesBySlug,
} from "./meta.repository.js";

export const getAllServiceCat = async (filters) => {
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
    const { datas, total } = await findAllServiceCats(
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
    throw new Error("Gagal Mengambil Seluruh Data Meta");
  }
};

export const getServiceCatById = async (id, filters) => {
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
      (await findServiceCatById(id, skip, limit, where, orderBy)) ||
      (await findPagesBySlug(id, skip, limit, where, orderBy));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createServiceCat = async (payload) => {
  try {
    const validPage = await findPagesBySlug(payload.page);
    if (!validPage) {
      throw new Error("Page tidak ditemukan");
    }
    const data = await insertServiceCat({ ...payload, page: validPage.slug });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteServiceCatById = async (id) => {
  try {
    await findServiceCatById(id);
    await deleteServiceCat(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateServiceCat = async (id, payload) => {
  try {
    const data = await findServiceCatById(id);
    if (!data) {
      throw new Error("Meta dengan Id tersebut tidak ditemukan");
    }
    await editServiceCat(id, payload);
  } catch (error) {
    throw new Error(error.message);
  }
};
