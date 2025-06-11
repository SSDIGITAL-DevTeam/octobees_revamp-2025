import dayjs from "dayjs";
import { blogCategory, metaTag, pages } from "../../drizzle/schema.js";
import {
  findAllPages,
  findPageById,
  insertPage,
  deletePage,
  editPage,
  findPageBySlug,
  findPageByTitle,
} from "./page.repository.js";
import { and, asc, desc, eq, gte, like, or } from "drizzle-orm";
import { findAllMetaTags } from "../meta/meta.repository.js";

export const getAllPages = async (filters) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      orderBy,
      categoryId,
      createdAt,
    } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];
    if (categoryId) whereConditions.push(eq(blogCategory.id, categoryId));
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;

      const searchFilters = [
        like(pages.page, keyword),
        like(pages.slug, keyword),
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
        case "this_week":
          dateFrom = now.startOf("week").toDate();
          break;
        case "this_month":
          dateFrom = now.startOf("month").toDate();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        whereConditions.push(gte(pages.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(pages[field]) : asc(pages[field]);
    });

    const { datas, total } = await findAllPages(skip, limit, where, order);

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

export const getPageById = async (id, filters) => {
  try {
    const { page, limit, orderBy, search, createdAt } = filters;
    const skip = (page - 1) * limit;

    const whereConditions = [];
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;

      const searchFilters = [
        like(metaTag.key, keyword),
        like(metaTag.slug, keyword),
        like(metaTag.value, keyword),
        like(metaTag.content, keyword),
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
        case "this_week":
          dateFrom = now.startOf("week").toDate();
          break;
        case "this_month":
          dateFrom = now.startOf("month").toDate();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        whereConditions.push(gte(metaTag.createdAt, dateFrom));
      }
    }

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(metaTag[field]) : asc(metaTag[field]);
    });

    let selectedPage = await findPageById(id);
    if (!selectedPage) {
      selectedPage = await findPageBySlug(id);
    }
    if (!selectedPage) {
      throw new Error("Page not found");
    }

    whereConditions.push(eq(pages.id, selectedPage.id));

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const { datas, total } = await findAllMetaTags(skip, limit, where, order);

    const totalPages = Math.ceil(total / limit);

    return {
      data: {
        pages: selectedPage,
        meta: [...datas],
      },
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

export const createPage = async (payload) => {
  try {
    const { page } = payload;
    const validPage = await findPageByTitle(page);
    if (validPage) {
      throw new Error("Page sudah ada");
    }

    const slug = page
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const data = await insertPage(page, slug, null);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePageById = async (id) => {
  try {
    await findPageById(id);
    await deletePage(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePage = async (id, payload) => {
  try {
    const data = await findPageById(id);
    if (!data) {
      throw new Error("Page dengan Id tersebut tidak ditemukan");
    }
    await editPage(id, payload);
  } catch (error) {
    throw new Error(error.message);
  }
};
