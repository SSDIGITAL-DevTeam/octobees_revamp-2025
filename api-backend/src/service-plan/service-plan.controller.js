import logger from "../../utils/logger.js";
import {
  getAllPlans,
  getPlanById,
  createPlan,
  removePlan,
  updatePlan,
} from "./service-plan.service.js";

const getall = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      orderBy,
      search,
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
      status,
      createdAt,
    };
    const data = await getAllPlans(filters);

    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.query;
    const filters = { status };
    const data = await getPlanById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const {
      name,
      type,
      showPrice,
      status,
      options,
      descriptions,
      categoryId,
      prices,
      benefits,
    } = req.body;

    if (
      !name ||
      !type ||
      showPrice == undefined ||
      !options ||
      !descriptions ||
      !categoryId ||
      !status ||
      prices.length == 0 ||
      Array.isArray(benefits) == false
    ) {
      throw new Error("Data is incomplete");
    }

    await createPlan(req.body);
    res.status(201).json({ message: "Package created successfully" });
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await removePlan(id);
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      type,
      showPrice,
      status,
      options,
      descriptions,
      categoryId,
      prices,
      benefits,
    } = req.body;

    if (
      !name ||
      !type ||
      showPrice == undefined ||
      !options ||
      !descriptions ||
      !categoryId ||
      !status ||
      prices.length == 0 ||
      Array.isArray(benefits) == false
    ) {
      throw new Error("Data is incomplete");
    }

    await updatePlan(id, req.body);
    res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
    logger.error(`PUT /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }

    await updatePlan(id, req.body);
    res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
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
