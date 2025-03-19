import { insertPage } from "../meta/meta.repository.js";
import {
  findAllServiceCats,
  findServiceCatByName,
  findServiceCatById,
  insertServiceCat,
  deleteServiceCat,
  editServiceCat,
  findServiceCatBySlug,
} from "./service-category.repository.js";
import {  categoryService,  planService } from "../../drizzle/schema.js";
import { and, eq ,or,like} from "drizzle-orm";

export const getAllServiceCat = async (filters) => {
 
  try {
    const { page = 1, limit = 10, status, orderBy = {}, search = "" } = filters;
    const skip = (page - 1) * limit;

    const whereConditions = [];
    // Status filter
    if (status) {
      whereConditions.push(eq(categoryService?.status, status));
    }
    //Search filter
    if (search) {
      
      const searchConditions = [
        like(categoryService.name, `%${search}%`),
        like(categoryService.heading, `%${search}%`),
        like(categoryService.description, `%${search}%`),
      ];
      // Extra condition if search matches status
      // if (["Draft", "Active", "NonActive"].includes(search)) {
      //   searchConditions.push(eq(categoryService.status, search));
      // }

      whereConditions.push(or(...searchConditions));
    }
   
    const finalWhere = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    //const finalWhere =undefined
    const { datas, total } = await findAllServiceCats(
      skip,
      limit,
      finalWhere,
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
      status
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal Mengambil Seluruh Data Service Category");
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

export const getServiceCatById = async (id, filters) => {
 
  try {
    const { status } = filters;
    const whereConditions = [];
    
    if (status) {
      whereConditions.push(eq(categoryService.status, status));
    }
     
    const finalWhere = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    //const finalWhere=undefined
    //let data =await findServiceCatById(id)
     //(await findServiceCatById(id)) || (await findServiceCatBySlug(id, finalWhere));
    let data =
      (await findServiceCatById(id)) || (await findServiceCatBySlug(id, finalWhere));
    if (!data) {
      throw new Error("Service Category tersebut tidak ditemukan");
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
      throw new Error("Service Category dengan nama tersebut sudah ada");
    }
    const slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
     
    const data = await insertServiceCat({ ...payload, slug });
  
    await insertPage(payload.name, slug, data.id );
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
      throw new Error("Service Category dengan Id tersebut tidak ditemukan");
    }
    
    const newSlug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await editServiceCat(id, { ...payload, slug: newSlug });
           
  } catch (error) {
    throw new Error(error.message);
  }
};
