import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { planService, categoryService, price, benefit } from "../../drizzle/schema.js";

// Ambil semua service plans dengan pagination & filter
export const findAllServicePlans = async (skip, limit, order, where) => {
  try {
    const query = db
      .select({
        ...planService,
        categoryName: categoryService.name,
        prices: price,
        benefits: benefit.value,
      })
      .from(planService)
      .leftJoin(categoryService, eq(categoryService.id, planService.categoryId))
      .leftJoin(price, eq(price.planServiceId, planService.id))
      .leftJoin(benefit, eq(benefit.planServiceId, planService.id));

    if (where) {
      query.where(where);
    }

    if (order) {
      query.orderBy(order);
    }

    query.offset(skip).limit(limit);

    const datas = await query;

    const [{ count: total }] = await db
      .select({ count: db.fn.count() })
      .from(planService)
      .where(where);

    return { datas, total };
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil seluruh data plan servis");
  }
};

// Cari plan service berdasarkan nama
export const findServiceCatByName = async (name) => {
  try {
    const data = await db
      .select({
        ...planService,
        prices: price,
        benefits: benefit.value,
      })
      .from(planService)
      .leftJoin(price, eq(price.planServiceId, planService.id))
      .leftJoin(benefit, eq(benefit.planServiceId, planService.id))
      .where(eq(planService.name, name))
      .limit(1);

    return data[0] || null;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil data berdasarkan nama");
  }
};

// Cari plan service berdasarkan ID
export const findServiceCatById = async (id) => {
  try {
    const data = await db
      .select({
        ...planService,
        categoryName: categoryService.name,
        prices: price,
        benefits: benefit.value,
      })
      .from(planService)
      .leftJoin(categoryService, eq(categoryService.id, planService.categoryId))
      .leftJoin(price, eq(price.planServiceId, planService.id))
      .leftJoin(benefit, eq(benefit.planServiceId, planService.id))
      .where(eq(planService.id, id))
      .limit(1);

    return data[0] || null;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};

// Tambahkan plan service baru
export const insertServiceCat = async (data) => {
  try {
    const { prices, benefits, ...planData } = data;

    const [insertedPlan] = await db
      .insert(planService)
      .values(planData)
      .returning({ id: planService.id });

    if (prices && prices.length) {
      await db.insert(price).values(
        prices.map((p) => ({
          ...p,
          planServiceId: insertedPlan.id,
        }))
      );
    }

    if (benefits && benefits.length) {
      await db.insert(benefit).values(
        benefits.map((b) => ({
          ...b,
          planServiceId: insertedPlan.id,
        }))
      );
    }

    return insertedPlan;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam penambahan service plan");
  }
};

// Hapus plan service berdasarkan ID
export const deleteServiceCat = async (id) => {
  try {
    await db.delete(price).where(eq(price.planServiceId, id));
    await db.delete(benefit).where(eq(benefit.planServiceId, id));
    await db.delete(planService).where(eq(planService.id, id));
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam penghapusan service plan");
  }
};

// Edit plan service
export const editServiceCat = async (id, data) => {
  try {
    const { prices, benefits, ...planData } = data;

    await db.update(planService).set(planData).where(eq(planService.id, id));

    await db.delete(price).where(eq(price.planServiceId, id));
    await db.delete(benefit).where(eq(benefit.planServiceId, id));

    if (prices && prices.length) {
      await db.insert(price).values(
        prices.map((p) => ({
          ...p,
          planServiceId: id,
        }))
      );
    }

    if (benefits && benefits.length) {
      await db.insert(benefit).values(
        benefits.map((b) => ({
          ...b,
          planServiceId: id,
        }))
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam mengubah service plan");
  }
};
