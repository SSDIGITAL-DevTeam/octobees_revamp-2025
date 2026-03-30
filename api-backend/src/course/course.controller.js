import {
  createCourse,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "./course.service.js";
import logger from "../../utils/logger.js";

const getall = async (req, res) => {
  try {
    const isAdmin = req.originalUrl.includes("back-office");
    let { page = 1, limit = 10, search, orderBy } = req.query;

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      orderBy: orderByParams,
    };

    const data = await getAllCourses(filters, isAdmin);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getCourseById(id);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    let { title, price, videoUrl, isActive } = req.body;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Banner image is required" });
    }

    if (!title || !price || !videoUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const payload = {
      title,
      price: parseFloat(price),
      videoUrl,
      isActive: isActive === "true" || isActive === true,
      bannerUrl: req.file.filename,
    };

    await createCourse(payload);
    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteCourseById(id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    let payload = { ...req.body };

    if (payload.price) payload.price = parseFloat(payload.price);
    if (payload.isActive !== undefined) payload.isActive = payload.isActive === "true" || payload.isActive === true;

    if (req.file) {
      payload.bannerUrl = req.file.filename;
    }

    await updateCourse(id, payload);
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    logger.error(`PATCH /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getall,
  getid,
  create,
  remove,
  patch,
};
