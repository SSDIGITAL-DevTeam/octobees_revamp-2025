import { and, asc, desc, eq, gte, like, or } from "drizzle-orm";
import {
  findAllCareers,
  findCareerById,
  insertCareer,
  deleteCareer,
  editCareer,
} from "./career.repository.js";
import { career } from "../../drizzle/schema.js";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import { findPositionById } from "../position/position.repository.js";

export const getAllCareers = async (filters) => {
  try {
    let { page = 1, limit = 10, status, search, orderBy, createdAt } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (status !== undefined) whereConditions.push(eq(career.status, status));
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(career.name, keyword),
        like(career.status, keyword),
        like(career.email, keyword),
        like(career.phoneNumber, keyword),
        like(career.positionId, keyword),
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
        whereConditions.push(gte(career.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(career[field]) : asc(career[field]);
    });

    const { datas, total } = await findAllCareers(skip, limit, where, order);

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

export const getCareerById = async (id, filters) => {
  try {
    const { status } = filters;
    const data = await findCareerById(id, status);
    if (!data) {
      throw new Error("Career is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCareer = async (payload) => {
  try {
    const { positionId } = payload;
    const newPositions = Number(positionId);
    const isPositionIdExist = await findPositionById(newPositions);
    if (!isPositionIdExist) {
      throw new Error("Position is not found");
    }
    await insertCareer({ ...payload, positionId: newPositions });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeCareer = async (id) => {
  try {
    const career = await findCareerById(id);
    if (!career) throw new Error("Career not found");

    // Path file resume
    const filePath = path.join("upload/resume", career.resume);

    // Hapus file jika ada
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Hapus dari database
    await deleteCareer(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCareer = async (id, payload) => {
  try {
    // const { name, email, phoneNumber, position, resume, portfolio, message } = payload;
    const data = await findCareerById(id);

    if (!data) {
      throw new Error("Career is not found");
    }

    const updatePayload = { ...payload };

    return await editCareer(id, updatePayload);
  } catch (error) {
    throw new Error(error.message);
  }
};
