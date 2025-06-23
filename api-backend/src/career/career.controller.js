import logger from "../../utils/logger.js";
import {
  getAllCareers,
  getCareerById,
  createCareer,
  removeCareer,
  updateCareer,
} from "./career.service.js";

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
    const data = await getAllCareers(filters);

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
    const data = await getCareerById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, phoneNumber, positionId, portfolio, message } = req.body;
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !positionId ||
      !portfolio ||
      !message
    ) {
      throw new Error("All fields is required");
    }
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Resume is required" });
    }

    const payload = {
      ...req.body,
      resume: req.file.filename,
    };
    await createCareer(payload);

    res.status(201).json({ message: "Career created successfully" });
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await removeCareer(id);
    res.status(200).json({ message: "Career deleted successfully" });
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phoneNumber, position, portfolio, message } = req.body;
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !position ||
      !portfolio ||
      !message
    ) {
      throw new Error("All fields is required");
    }
    const payload = { ...req.body };
    if (req.file) {
      payload.resume = req.file.filename;
    } else {
      delete payload.resume;
    }
    await updateCareer(id, payload);
    res.status(200).json({ message: "Career Updated Successfully" });
  } catch (error) {
    logger.error("PUT /:id error:", error);
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
    await updateCareer(id, payload);
    res.status(200).json({ message: "Career Updated Successfully" });
  } catch (error) {
    logger.error("PATCH /:id error:", error);
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
