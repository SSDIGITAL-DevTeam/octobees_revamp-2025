import { and, asc, desc, eq, gte, like, or } from "drizzle-orm";
import {
  findAllPositions,
  findPositionById,
  insertPosition,
  deletePosition,
  editPosition,
  findPositionByName,
} from "./position.repository.js";
import { position } from "../../drizzle/schema.js";
import dayjs from "dayjs";

export const getAllPositions = async (filters) => {
  try {
    let { page = 1, limit = 10, status, search, orderBy, createdAt } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (status !== undefined) whereConditions.push(eq(position.status, status));
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(position.name, keyword),
        like(position.status, keyword),
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
        whereConditions.push(gte(position.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc"
        ? desc(position[field])
        : asc(position[field]);
    });

    const { datas, total } = await findAllPositions(skip, limit, where, order);

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

export const getPositionById = async (id, filters) => {
  try {
    const { status } = filters;
    const data = await findPositionById(id, status);
    if (!data) {
      throw new Error("Position is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPosition = async (payload) => {
  try {
    const isNameExist = await findPositionByName(payload.name);
    if (isNameExist) {
      throw new Error("Position name already exist");
    }
    await insertPosition({ ...payload });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removePosition = async (id) => {
  try {
    const career = await findPositionById(id);
    if (!career) throw new Error("Position not found");
    await deletePosition(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePosition = async (id, payload) => {
  try {
    const data = await findPositionById(id);

    if (!data) {
      throw new Error("Position is not found");
    }

    if(data.name && data.name !== payload.name) {
      const isNameExist = await findPositionByName(payload.name);
      if (isNameExist) {
        throw new Error("Position name already exist");
      }
    }

    const updatePayload = { ...payload };

    return await editPosition(id, updatePayload);
  } catch (error) {
    throw new Error(error.message);
  }
};
