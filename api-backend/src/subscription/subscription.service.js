import { and, asc, desc, gte, like, or } from "drizzle-orm";
import {
  findAllSubscriptions,
  findSubscriptionById,
  insertSubscription,
  deleteSubscription,
  editSubscription,
} from "./subscription.repository.js";
import { subscription } from "../../drizzle/schema.js";
import dayjs from "dayjs";
import { verifyRecaptchaToken } from "../../utils/validateToken.js";

export const getAllSubscriptions = async (filters) => {
  try {
    let { page = 1, limit = 10, search, orderBy, createdAt } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(subscription.email, keyword),
        like(subscription.source, keyword),
        like(subscription.insight, keyword),
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
        whereConditions.push(gte(subscription.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc"
        ? desc(subscription[field])
        : asc(subscription[field]);
    });

    const { datas, total } = await findAllSubscriptions(
      skip,
      limit,
      where,
      order
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
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const getSubscriptionById = async (id) => {
  try {
    let _subscription = await findSubscriptionById(id);
    if (!_subscription) {
      throw new Error("Subscritption is not found");
    }
    return _subscription;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createSubscription = async (payload) => {
  try {
    await verifyRecaptchaToken(payload.token);
    await insertSubscription(payload);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeSubscription = async (id) => {
  try {
    const isSubsExist = await findSubscriptionById(id);
    if (!isSubsExist) {
      throw new Error("Subscription is not found");
    }
    await deleteSubscription(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateSubscription = async (id, payload) => {
  try {
    const _subscription = await findSubscriptionById(id);
    if (!_subscription) {
      throw new Error("Subscription is not found");
    }
    await editSubscription(id, payload);
  } catch (error) {
    throw new Error(error.message);
  }
};
