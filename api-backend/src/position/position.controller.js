import logger from "../../utils/logger.js";
import {
  getAllPositions,
  getPositionById,
  createPosition,
  removePosition,
  updatePosition,
} from "./position.service.js";

const getall = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      search,
      orderBy,
      createdAt,
    } = req.query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = String(orderBy)
        .split(",")
        .map((order) => {
          const [field, dir] = order.split(":");
          return { [field]: dir === "desc" ? "desc" : "asc" };
        });
    }

    const filters = {
      page,
      limit,
      status,
      search,
      orderBy: orderByParams,
      createdAt,
    };
    const data = await getAllPositions(filters);

    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET POSITION / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.query;
    const filters = { status };
    const data = await getPositionById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET POSITION /:ID error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("All fields is required");
    }
    const payload = {
      ...req.body,
    };
    await createPosition(payload);

    res.status(201).json({ message: "Position created successfully" });
  } catch (error) {
    logger.error(`POST POSITION / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await removePosition(id);
    res.status(200).json({ message: "Position deleted successfully" });
  } catch (error) {
    logger.error(`DELETE POSITION /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) {
      throw new Error("All fields is required");
    }
    const payload = { ...req.body };
    if (req.file) {
      payload.resume = req.file.filename;
    } else {
      delete payload.resume;
    }
    await updatePosition(id, payload);
    res.status(200).json({ message: "Position Updated Successfully" });
  } catch (error) {
    logger.error(`PUT POSITION /:ID error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }
    const payload = { ...req.body };
    if (req.file) {
      payload.resume = req.file.filename;
    } else {
      delete payload.resume;
    }
    await updatePosition(id, payload);
    res.status(200).json({ message: "Position Updated Successfully" });
  } catch (error) {
    logger.error(`PATCH POSITION /:ID error: ${error.message}`);
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
