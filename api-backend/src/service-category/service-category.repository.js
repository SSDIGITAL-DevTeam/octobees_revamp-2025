import { db } from "../../drizzle/db.js";
import {  categoryService,  planService } from "../../drizzle/schema.js";
import { eq, asc, desc, sql, and } from "drizzle-orm";
import { v7 as uuidv7 } from 'uuid'; // Import uuid7 generator
// 1. Find All Service Categories
export const findAllServiceCats = async (skip, limit, where = undefined, orderBy = {}) => {
  
    try {
        

        // const query = db
        //     .select()
        //     .from(categoryService)
        //     .where(where ? where : undefined) // optional
        //     .limit(limit) // optional
        //     .offset(skip) // optional
        //     // .orderBy(
        //     //     ...Object.entries(orderBy).map(([key, value]) =>
        //     //     value === 'asc' ? asc(categoryService[key]) : desc(categoryService[key])
        //     //     )
        //     // );
        // const datas = await query;
    
            const datas = await db.query.categoryService.findMany({
                offset: skip,
                limit: limit,
                // orderBy: orderBy,
                where: where
              });
        

        const [{ count: total }] = await db
            .select({ count: sql`COUNT(*)` })
            .from(categoryService)
            .where(where ? where : undefined) // optional

        return { datas, total: Number(total) };
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan mengambil seluruh data category services");
    }
};

// 2. Find by Name
export const findServiceCatByName = async (name) => {
    
    try {

        const data = await db.select()
          .from(categoryService)
          .where(eq(categoryService.name, name))
          .limit(1);
          if(data.length>0){
            return data[0] || null;
          }
      
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan mengambil data berdasarkan nama");
    }
};

// 3. Find by ID with relations
export const findServiceCatById = async (id) => {
    
    try {
        const data = await db.query.categoryService.findFirst({
            where: eq(categoryService.id, id),
            with: {
                plans: {
                    with: {
                        prices: true,
                        benefits: true
                    }
                }
            }
        });
        return data || null;
    } catch (error) {
        console.error("Error fetching Category by ID:", error);
        throw new Error("Kesalahan mengambil data berdasarkan ID");
    }
};

// 4. Find by Slug with optional where condition for plans
export const findServiceCatBySlug = async (slug, whereCat = undefined) => {
    //    return "TEst"
    
    try {
        const data = await db.query.categoryService.findFirst({
            where: eq(categoryService.slug, slug),
            with: {
                plans: {
                   // where: whereCat,
                   where: (whereCat)?whereCat:undefined,
                    with: {
                        prices: true,
                        benefits: true
                    }
                }
            }
        });
        return data || null;
    } catch (error) {
        console.error("Error fetching Category by Slug:", error);
        throw new Error("Kesalahan mengambil data berdasarkan Slug");
    }
};

// 5. Insert Service Category
export const insertServiceCat = async (data) => {
    
    try {
        const id = uuidv7(); // Generate UUIDv7
        
        await db.insert(categoryService).values({
            id, // Set ID secara manual
            ...data
        });
        // Karena MySQL tidak support returning, kita return manual
        return { id, ...data };
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan dalam penambahan service category");
    }
};

// 6. Delete Service Category
export const deleteServiceCat = async (id) => {
    try {
        await db.delete(categoryService).where(eq(categoryService.id, id));
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan dalam penghapusan service category");
    }
};

// 7. Edit Service Category
export const editServiceCat = async (id, data) => {
   
    try {

        await db.update(categoryService).set(data).where(eq(categoryService.id, id));
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan dalam mengubah service category");
    }
};
