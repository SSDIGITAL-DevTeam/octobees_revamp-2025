import {
  findAllBlogCats,
  findBlogCatByName,
  findBlogCatById,
  insertBlogCat,
  deleteBlogCat,
  editBlogCat,
  findBlogCatBySlug,
} from "./blog-category.repository.js";

export const getAllBlogCat = async (filters) => {
  try {
    const { page, limit, status, search, orderBy } = filters;
    const skip = (page - 1) * limit;
    const where = {
      AND: [
        ...(status ? [{ status }] : []),
        {
          OR: [
            { name: { contains: search } },
            ...(search && ["Draft", "Active", "NonActive"].includes(search) ? [{ status: search }] : []),
          ],
        },
      ],
    };

    const {datas, total} = await findAllBlogCats(skip, limit, where, orderBy);

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
    throw new Error("Gagal Mengambil Seluruh Data Blog Category");
  }
};
export const getBlogCatByName = async (name) => {
  try {
    const data =
      (await findBlogCatByName(name)) || (await findBlogCatBySlug(name));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getBlogCatById = async (id, filters) => {
  try {
    const { status } = filters;
    const where = {
      ...(status && { status }),
    };
    let data =
      (await findBlogCatById(id, where)) ||
      (await findBlogCatBySlug(id, where));
    if (!data) {
      throw new Error("Blog Category tersebut tidak ditemukan");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createBlogCat = async (payload) => {
  try {
    const checkName = await getBlogCatByName(payload.name);
    if (checkName) {
      throw new Error("Blog Category dengan nama tersebut sudah ada");
    }
    const slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const data = await insertBlogCat({ ...payload, slug });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteBlogCatById = async (id) => {
  try {
    await findBlogCatById(id);
    await deleteBlogCat(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateBlogCat = async (id, payload) => {
  try {
    const data = await findBlogCatById(id);
    if (!data) {
      throw new Error("Blog Category dengan Id tersebut tidak ditemukan");
    }
    const newSlug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    await editBlogCat(id, { ...payload, slug: newSlug });
  } catch (error) {
    throw new Error(error.message);
  }
};
