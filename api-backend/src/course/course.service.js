import {
  findAllCourses,
  findCourseById,
  insertCourse,
  updateCourseQuery,
  deleteCourseByIdQuery,
} from "./course.repository.js";
import { course } from "../../drizzle/schema.js";
import { and, asc, desc, like, or, eq } from "drizzle-orm";

export const getAllCourses = async (filters, isAdmin = false) => {
  try {
    let { page = 1, limit = 10, search, orderBy } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    // Jika dipanggil dari endUser, hanya retur course aktif
    if (!isAdmin) {
      whereConditions.push(eq(course.isActive, true));
    }

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [like(course.title, keyword)];
      whereConditions.push(or(...searchFilters));
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(course[field]) : asc(course[field]);
    });

    const { datas, total } = await findAllCourses(skip, limit, where, order);

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

export const getCourseById = async (id) => {
  try {
    let data = await findCourseById(id);
    if (!data) {
      throw new Error("Course is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCourse = async (payload) => {
  try {
    await insertCourse(payload);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCourse = async (id, payload) => {
  try {
    await updateCourseQuery(id, payload);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteCourseById = async (id) => {
  try {
    await deleteCourseByIdQuery(id);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
