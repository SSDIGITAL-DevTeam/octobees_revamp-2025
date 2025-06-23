import logger from "../../utils/logger.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  removeCategory,
  updateCategory,
} from "./service-category.service.js";

const getall = async (req, res) => {
  try {
    let { page = 1, limit = 10, status, orderBy, search, createdAt } = req.query;
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = { page, limit, status, orderBy: orderByParams, search, createdAt };
    const data = await getAllCategories(filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET CATEGORY / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.query;
    const filters = { status };
    const data = await getCategoryById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET CATEGORY /:ID error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, heading, description, status } = req.body;
    if (!name || !heading || !description || !status) {
      throw new Error("Data is incomplete");
    }
    await createCategory(req.body);
    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    logger.error(`POST CATEGORY / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await removeCategory(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    logger.error(`DELETE CATEGORY /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, heading, description, status } = req.body;
    if (!name || !heading || !description || !status) {
      throw new Error("Data is incomplete");
    }
    await updateCategory(id, req.body);
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    logger.error(`PUT CATEGORY /:ID error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }
    await updateCategory(id, req.body);
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    logger.error(`PATCH CATEGORY /:ID error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getall,
  getid,
  create,
  remove,
  put,
  patch,
};
