import {
  findAllCoursePurchases,
  findCoursePurchaseById,
  insertCoursePurchase,
  updateCoursePurchaseStatusQuery,
} from "./course-purchase.repository.js";
import { coursePurchase } from "../../drizzle/schema.js";
import { and, asc, desc, like, or } from "drizzle-orm";

export const getAllCoursePurchases = async (filters) => {
  try {
    let { page = 1, limit = 10, search, orderBy } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(coursePurchase.customerName, keyword),
        like(coursePurchase.customerEmail, keyword),
        like(coursePurchase.customerPhone, keyword),
        like(coursePurchase.status, keyword),
      ];
      whereConditions.push(or(...searchFilters));
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(coursePurchase[field]) : asc(coursePurchase[field]);
    });

    const finalOrder = order.length > 0 ? order : [desc(coursePurchase.createdAt)];

    const { datas, total } = await findAllCoursePurchases(skip, limit, where, finalOrder);

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

export const getCoursePurchaseById = async (id) => {
  try {
    let data = await findCoursePurchaseById(id);
    if (!data) {
      throw new Error("Course Purchase is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const submitCoursePurchase = async (payload) => {
  try {
    await insertCoursePurchase(payload);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCoursePurchaseStatus = async (id, status) => {
  try {
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        throw new Error("Invalid status");
    }
    await updateCoursePurchaseStatusQuery(id, status);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
