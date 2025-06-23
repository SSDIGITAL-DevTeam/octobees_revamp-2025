import {
  findAllOrders,
  findOrderById,
  insertOrder,
} from "./order.repository.js";
import { order as orderLead } from "../../drizzle/schema.js";
import dayjs from "dayjs";
import { and, asc, desc, gte, like, or } from "drizzle-orm";

{
  /**
      id             
      amount      
      bussiness   
      category    
      categoryId  
      date        
      email       
      message     
      name        
      phoneNumber 
      plan        
      idPlan      
      time        
      **/
}

export const getAllOrders = async (filters) => {
  try {
    let { page = 1, limit = 10, search, orderBy, createdAt, date } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(orderLead.amount, keyword),
        like(orderLead.bussiness, keyword),
        like(orderLead.categoryId, keyword),
        like(orderLead.date, keyword),
        like(orderLead.email, keyword),
        like(orderLead.idPlan, keyword),
        like(orderLead.message, keyword),
        like(orderLead.name, keyword),
        like(orderLead.phoneNumber, keyword),
        like(orderLead.time, keyword),
      ];
      whereConditions.push(or(...searchFilters));
    }
    if (date) {
      const searchFilters = [
        like(orderLead.date, `%${date.toLowerCase()}%`),
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
        whereConditions.push(gte(orderLead.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc"
        ? desc(orderLead[field])
        : asc(orderLead[field]);
    });

    const { datas, total } = await findAllOrders(skip, limit, where, order);

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

export const getOrderById = async (id) => {
  try {
    let data = await findOrderById(id);
    if (!data) {
      throw new Error("Order is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createOrder = async (payload) => {
  try {
    const data = await insertOrder(payload);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
