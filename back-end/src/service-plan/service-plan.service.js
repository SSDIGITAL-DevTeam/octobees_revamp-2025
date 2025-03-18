import {
  findAllServicePlans,
  findServiceCatByName,
  findServiceCatById,
  insertServiceCat,
  deleteServiceCat,
  editServiceCat,
} from "./service-plan.repository.js";

export const getAllServicePlan = async (filters) => {
  try {
    const { page, limit, status,  orderBy, search } = filters;
    const skip = (page - 1) * limit;
    const where = {
        AND: [
          ...(status ? [{ status }] : []),
          {
            OR: [
              { name: { contains: search } },
              { descriptions: { contains: search } },
              { options: { contains: search } },
              ...(search && ["Draft", "Active", "NonActive"].includes(search) ? [{ status: search }] : []),
              ...(search && ["Standard", "Premium"].includes(search) ? [{ type: search }] : []),
            ],
          },
        ],
      };

    const {datas, total} = await findAllServicePlans(skip, limit, orderBy, where);
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
    console.log({error})
    throw new Error("Gagal Mengambil Seluruh Data Service Plan");
  }
};
export const getServiceCatByName = async (name) => {
  try {
    const data = await findServiceCatByName(name);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getServiceCatById = async (id) => {
  try {
    let data = await findServiceCatById(id);
    if (!data) {
      throw new Error("Service Plan tersebut tidak ditemukan");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createServiceCat = async (payload) => {
  try {
    const checkName = await getServiceCatByName(payload.name);
    if (checkName) {
      throw new Error("Service Plan dengan nama tersebut sudah ada");
    }
    const data = await insertServiceCat(payload);
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
      throw new Error("Service Plan dengan Id tersebut tidak ditemukan");
    }
    await editServiceCat(id, payload);
  } catch (error) {
    throw new Error(error.message);
  }
};
