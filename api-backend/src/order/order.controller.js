import { getAllOrders, getOrderById, createOrder } from "./order.service.js";
import logger from "../../utils/logger.js";

const getall = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy,
      search,
      date,
      createdAt,
    } = req.query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = {
      page,
      limit,
      orderBy: orderByParams,
      search,
      date,
      createdAt,
    };
    const data = await getAllOrders(filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET ORDER / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getOrderById(id);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET ORDER /:ID error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
{
  /**
  name: 'Ryan Kusuma',
  email: 'ryan@gmail.com',
  phoneNumber: '+624567567',
  bussiness: 'bahagia',
  message: 'tidak tahu',
  date: 'March 6th, 2025',
  time: '09:00',
  plan: '73028bab-de00-4ed4-b248-b913d1dcb494',
  category: '1a4e5b76-cea0-4fdb-b4d9-d6f0be63e08e',
  amount: 'Rp 620000'
  */
}

const create = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      bussiness,
      message,
      date,
      time,
      amount,
      currency,
      categoryId,
      idPlan,
    } = req.body;
    if (
      !name ||
      !amount ||
      !currency ||
      !bussiness ||
      !categoryId ||
      !date ||
      !email ||
      !message ||
      !phoneNumber ||
      !idPlan ||
      !time
    ) {
      throw new Error("Data is not complete");
    }
    await createOrder(req.body);
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    logger.error(`POST ORDER / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getall,
  getid,
  create,
};
