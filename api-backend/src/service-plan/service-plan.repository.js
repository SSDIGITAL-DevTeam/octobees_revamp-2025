import { count, eq, inArray } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
  planService,
  categoryService,
  price,
  benefit,
} from "../../drizzle/schema.js";
import { v7 as uuidv7 } from "uuid";
import logger from "../../utils/logger.js";

const attachPlanRelations = async (plans) => {
  if (!plans.length) return plans;

  const planIds = plans.map((plan) => plan.id);
  const categoryIds = [
    ...new Set(plans.map((plan) => plan.categoryId).filter(Boolean)),
  ];

  const categories = categoryIds.length
    ? await db
        .select()
        .from(categoryService)
        .where(inArray(categoryService.id, categoryIds))
    : [];
  const prices = await db.select().from(price).where(inArray(price.idPlan, planIds));
  const benefits = await db
    .select()
    .from(benefit)
    .where(inArray(benefit.idPlan, planIds));

  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const pricesByPlanId = new Map();
  const benefitsByPlanId = new Map();

  for (const item of prices) {
    const collection = pricesByPlanId.get(item.idPlan) || [];
    collection.push(item);
    pricesByPlanId.set(item.idPlan, collection);
  }

  for (const item of benefits) {
    const collection = benefitsByPlanId.get(item.idPlan) || [];
    collection.push(item);
    benefitsByPlanId.set(item.idPlan, collection);
  }

  return plans.map((plan) => ({
    ...plan,
    category: categoryById.get(plan.categoryId) || null,
    prices: pricesByPlanId.get(plan.id) || [],
    benefits: benefitsByPlanId.get(plan.id) || [],
  }));
};

export const findAllPlans = async (skip, limit, where, orderBy) => {
  try {
    let query = db.select().from(planService);
    if (where) query = query.where(where);
    if (orderBy) query = query.orderBy(...orderBy);

    const plans = await query.limit(limit).offset(skip);
    const datas = await attachPlanRelations(plans);

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
    const plans = await db
      .select()
      .from(planService)
      .where(eq(planService.name, name))
      .limit(1);
    const [data] = await attachPlanRelations(plans);
    return data || null;
  } catch (error) {
    logger.error(`GET /:NAME error: ${error.message}`);
    throw new Error("Get Plan By Name Unsuccessfully");
  }
};
export const findPlanById = async (id) => {
  try {
    const plans = await db
      .select()
      .from(planService)
      .where(eq(planService.id, id))
      .limit(1);
    const [data] = await attachPlanRelations(plans);
    return data || null;
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
