// import prisma from "../../lib/prisma.js";

import { db } from "../../drizzle/db.js";
import {  order,  planService } from "../../drizzle/schema.js";
import { v7 as uuidv7 } from 'uuid'; // Import uuid7 generatorx
// import { eq, asc, desc, sql, and } from "drizzle-orm";

export const findAllServiceCats = async (skip, limit) => {
    try {
        const datas = await db.query.order.findMany({
            with: {
              category: {
                columns: {
                  name: true
                }
              },
              plan: {
                columns: {
                  name: true
                }
              }
            }
          });
          
          return datas;
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan mengambil seluruh data plan servis");
    }
}


export const findServiceCatById = async (id) => {
    try {
        const data = await db.query.order.findFirst({
            where: (order, { eq }) => eq(order.id, id),
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
        return data;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw new Error("Kesalahan mengambil data berdasarkan ID");
    }
};

export const insertServiceCat = async (data) => {
    try {
        const id = uuidv7(); // Generate UUIDv7
      
        await db.insert(order).values({
            id, // Set ID secara manual
            ...data
        })
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penambahan service plan");
    }
};


export const deleteServiceCat = async (id) => {
    try {
        await prisma.order.delete({
            where: { id },
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam penghapusan service plan");
    }
};

export const editServiceCat = async (id, data) => {
    try {
        await prisma.order.update({
            where: { id },
            data
        });
    } catch (error) {
        console.log(error)
        throw new Error("Kesalahan dalam mengubah service plan");
    }
};