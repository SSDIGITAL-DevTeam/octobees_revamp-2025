import { findAllServiceCats } from "../meta/meta.repository.js";
import {
  findAllPages,
  findServiceCatById,
} from "./pages.repository.js";

export const getAllServiceCat = async (filters) => {
  try {
    const { page, limit} = filters;
    const skip = (page - 1) * limit;
    
    const {datas, total} = await findAllPages(skip, limit);
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
    throw new Error("Gagal Mengambil Seluruh Data Pages");
  }
};

export const getServiceCatById = async (id, filters) => {
  try {
    const { page, limit, orderBy, search } = filters;
    const skip = (page - 1) * limit;
    const datas = await findServiceCatById(id)
    const where = {
      AND: [
        ...(datas.slug ? [{ slug: datas.slug }] : []),
        {
          OR: [
            { key: { contains: search } },
            { value: { contains: search } },
            { content: { contains: search } },
          ],
        }
      ]
    };
    const {datas : metaData, total} = await findAllServiceCats(skip, limit, where, orderBy)
    const totalPages = Math.ceil(total / limit);

    return {
      pages:datas,
      data: metaData,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  } catch (error) {
    console.log(error)
    throw new Error(error.message);
  }
};
