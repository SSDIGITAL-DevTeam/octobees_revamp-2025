import { eq ,sql} from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { planService, categoryService, price, benefit } from "../../drizzle/schema.js";
import { v7 as uuidv7 } from 'uuid';
// Ambil semua service plans dengan pagination & filter
export const findAllServicePlans = async (skip, limit, order, where) => {

  try {
    // Main query with joins

    // const datasQuery = db
    //   .select()
    //   .from(planService)
    //   .where(where ? where : undefined) // optional
    //     // .orderBy(
    //     //     ...Object.entries(orderBy).map(([key, value]) =>
    //     //     value === 'asc' ? asc(planService[key]) : desc(planService[key])
    //     //     )
    //     // )

    //   .leftJoin(categoryService, eq(planService.categoryId, categoryService.id))
    //   .leftJoin(price, eq(planService.id, price.idPlan))
    //   .leftJoin(benefit, eq(planService.id, benefit.idPlan))
    //   .offset(skip)
    //   .limit(limit);

    const datasQuery = await db.query.planService.findMany({
      where: where ? where : undefined,
      with: {
        category: true,
        prices: true,
        benefits: true
      },
      limit: limit,
      offset: skip
    })
      
    // Apply ordering if provided
  
    const datas = await datasQuery;
    
    const [{ count: total }] = await db
    .select({ count: sql`COUNT(*)` })
    .from(planService)
    .where(where ? where : undefined) // optional

   //.where(where ? where : undefined) // optional
    // Get total count

    return { datas, total: Number(total) };
 


  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil seluruh data plan servis");
  }
};

// Cari plan service berdasarkan nama
export const findServiceCatByName = async (name) => {
  try {
    const data = await db.query.planService.findFirst({
      where: (planService, { eq }) => eq(planService.name, name),
      with: {
        prices: true,
        benefits: {
          columns: {
            value: true
          }
        }
      }
    });
    return data || null;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil data berdasarkan nama");
  }
};

// Cari plan service berdasarkan ID
export const findServiceCatById = async (id) => {
  try {
    const data = await db.query.planService.findFirst({
      where: (planService, { eq }) => eq(planService.id, id),
      with: {
        category: {
          columns: {
            name: true
          }
        },
        prices: true,
        benefits: {
          columns: {
            value: true
          }
        }
      }
    });

    return data || null;
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};

// Tambahkan plan service baru
export const insertServiceCat = async (data) => {

  try {
    await db.transaction(async (tx) => {
    
      const { prices, benefits, ...planData } = data;

      let idPlan = uuidv7()
 
      const newPlanService = await tx.insert(planService).values(
        {
          id:idPlan, // Set ID secara manual
          ...planData
        }
      );
   
      if (prices) {
        await tx.insert(price).values(prices.map(price => ({
          ...price,
          id:uuidv7(),

          idPlan: idPlan
        })));
      }
     
      if (benefits) {
        await tx.insert(benefit).values(benefits.map(benefit => ({
          ...benefit, 
          id:uuidv7(),
          idPlan: idPlan
        })));
      }
    });

    return data;
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

    await db.delete(price).where(eq(price.idPlan, id));
    await db.delete(benefit).where(eq(benefit.idPlan, id));
    await db.update(planService).set(planData).where(eq(planService.id, id));
    if (prices && prices.length) {
      await db.insert(price).values(
        prices.map((p) => ({
          ...p,
          idPlan: id,
          id:uuidv7()
        }))
      );
    }   

    if (benefits && benefits.length) {
      await db.insert(benefit).values(
        benefits.map((b) => ({
          ...b,
          idPlan: id,
          id:uuidv7()
        }))
      );
    }
    return data
  } catch (error) {
    console.log(error);
    throw new Error("Kesalahan dalam mengubah service plan");
  }
};
