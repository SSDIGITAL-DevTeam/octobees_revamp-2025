import { planService } from "../../drizzle/schema.js";
import {
  findAllPlans,
  findPlanById,
  insertPlan,
  deletePlan,
  editPlan,
  findPlanByName,
} from "./service-plan.repository.js";
import {findCategoryById} from "../service-category/service-category.repository.js";
import { and, eq, or, like, desc, asc, gte } from "drizzle-orm";
import dayjs from "dayjs";
export const getAllPlans = async (filters) => {
  try {
    let { page = 1, limit = 10, status, search, orderBy, createdAt } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (status !== undefined)
      whereConditions.push(eq(planService.status, status));

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(planService.name, keyword),
        like(planService.descriptions, keyword),
        like(planService.options, keyword),
        like(planService.status, keyword),
        like(planService.type, keyword),
      ];

      whereConditions.push(or(...searchFilters));
    }

    if (createdAt) {
      let dateFrom;
      const now = dayjs();

      switch (createdAt) {
        case "today":
          dateFrom = now.startOf("day").toDate();
          break;
        case "week":
          dateFrom = now.startOf("week").toDate();
          break;
        case "month":
          dateFrom = now.startOf("month").toDate();
          break;
        case "year":
          dateFrom = now.startOf("year").toDate();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        whereConditions.push(gte(planService.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc"
        ? desc(planService[field])
        : asc(planService[field]);
    });

    const { datas, total } = await findAllPlans(skip, limit, where, order);

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
    throw new Error(error);
  }
};

export const getPlanById = async (id) => {
  try {
    let data = await findPlanById(id);
    if (!data) {
      throw new Error("Plan is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPlan = async (payload) => {
  try {
    const checkName = await findPlanByName(payload.name);
    if (checkName) {
      throw new Error("Package name already exist");
    }
    const checkCategory = await findCategoryById(payload.categoryId);
    if (!checkCategory) {
      throw new Error("Category is not found");
    }
    const data = await insertPlan(payload);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removePlan = async (id) => {
  try {
    const data = await findPlanById(id);
    if (!data) {
      throw new Error("Plan is not found");
    }
    await deletePlan(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePlan = async (id, payload) => {
  try {
    const data = await findPlanById(id);
    if (!data) {
      throw new Error("Plan is not found");
    }
    await editPlan(id, payload);
  } catch (error) {
    throw new Error(error.message);
  }
};
