import { db } from "../../drizzle/db.js";
import {  categoryService,  planService } from "../../drizzle/schema.js";
import { eq, asc, desc, sql, and } from "drizzle-orm";

// 1. Find All Service Categories
export const findAllServiceCats = async (skip, limit, where = {}, orderBy = {}) => {
  
    try {
        
        // const datas = await db.query.categoryService.findMany({
        //     // where,
        //     offset: skip,
        //     limit,
        //     orderBy: Object.entries(orderBy).map(([key, value]) =>
        //         value === 'asc' ? asc(CategoryService[key]) : desc(CategoryService[key])
        //     )
        // });
        const datas = await db
        .select()
        .from(categoryService)
        // .where(where) // optional
        // .limit(limit) // optional
        // .offset(skip) // optional
        // .orderBy(
        //     ...Object.entries(orderBy).map(([key, value]) =>
        //     value === 'asc' ? asc(categoryService[key]) : desc(categoryService[key])
        //     )
        // );
   
        
     

        const [{ count: total }] = await db
            .select({ count: sql`COUNT(*)` })
            .from(categoryService)
            // .where(where);

        return { datas, total: Number(total) };
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan mengambil seluruh data category services");
    }
};

// 2. Find by Name
export const findServiceCatByName = async (name) => {
    try {
        const data = await db.query.CategoryService.findFirst({
            where: eq(categoryService.name, name)
        });
        return data || null;
    } catch (error) {
        console.error(error);
        throw new Error("Kesalahan mengambil data berdasarkan nama");
    }
};

// 3. Find by ID with relations
export const findServiceCatById = async (id) => {
    try {
        const data = await db.query.CategoryService.findFirst({
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
export const findServiceCatBySlug = async (slug, whereCat = {}) => {
    try {
        const data = await db.query.CategoryService.findFirst({
            where: eq(categoryService.slug, slug),
            with: {
                plans: {
                    where: whereCat,
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
        const [inserted] = await db.insert(categoryService).values(data).returning();
        return inserted;
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
