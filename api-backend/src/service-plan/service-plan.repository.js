import { count, eq, sql } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
  planService,
  categoryService,
  price,
  benefit,
} from "../../drizzle/schema.js";
import { v7 as uuidv7 } from "uuid";
import logger from "../../utils/logger.js";

export const findAllPlans = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.planService.findMany({
      where,
      with: {
        category: true,
        prices: true,
        benefits: true,
      },
      limit: limit,
      offset: skip,
      orderBy,
    });

    const totalQuery = db.select({ count: count() }).from(planService);
    if (where) totalQuery.where(where);
    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    throw new Error("Get All Plan Unsuccessfully");
  }
};

export const findPlanByName = async (name) => {
  try {
    const data = await db.query.planService.findFirst({
      where: eq(planService.name, name),
      with: {
        category: {
          columns: {
            name: true,
          },
        },
        prices: true,
        benefits: {
          columns: {
            value: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error(`GET /:NAME error: ${error.message}`);
    throw new Error("Get Plan By Name Unsuccessfully");
  }
};
export const findPlanById = async (id) => {
  try {
    const data = await db.query.planService.findFirst({
      where: eq(planService.id, id),
      with: {
        category: {
          columns: {
            name: true,
          },
        },
        prices: true,
        benefits: {
          columns: {
            value: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error(`GET /:ID error: ${error.message}`);
    throw new Error("Get Plan By Id Unsuccessfully");
  }
};

export const insertPlan = async (data) => {
  try {
    await db.transaction(async (tx) => {
      const { prices, benefits, ...rest } = data;

      let idPlan = uuidv7();

      await tx.insert(planService).values({
        id: idPlan,
        ...rest,
      });

      if (prices) {
        await tx.insert(price).values(
          prices.map((price) => ({
            ...price,
            id: uuidv7(),
            idPlan,
          }))
        );
      }

      if (benefits) {
        await tx.insert(benefit).values(
          benefits.map((benefit) => ({
            ...benefit,
            id: uuidv7(),
            idPlan,
          }))
        );
      }
    });

    return data;
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    throw new Error("Create Plan Unsuccessfully");
  }
};

export const deletePlan = async (id) => {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(price).where(eq(price.idPlan, id));
      await tx.delete(benefit).where(eq(benefit.idPlan, id));
      await tx.delete(planService).where(eq(planService.id, id));
    });
  } catch (error) {
    logger.error(`DELETE /:ID error: ${error.message}`);
    throw new Error("Delete Plan Unsuccessfully");
  }
};

export const editPlan = async (id, data) => {
  try {
    const { prices, benefits, ...planData } = data;
    await db.delete(price).where(eq(price.idPlan, id));
    await db.delete(benefit).where(eq(benefit.idPlan, id));
    await db.update(planService).set(planData).where(eq(planService.id, id));
    if (prices && prices.length) {
      await db.insert(price).values(
        prices.map((p) => ({
          ...p,
          idPlan: id,
          id: uuidv7(),
        }))
      );
    }

    if (benefits && benefits.length) {
      await db.insert(benefit).values(
        benefits.map((b) => ({
          ...b,
          idPlan: id,
          id: uuidv7(),
        }))
      );
    }
    return data;
  } catch (error) {
    logger.error(`UPDATE /:ID error: ${error.message}`);
    throw new Error("Update Plan Unsuccessfully");
  }
};
