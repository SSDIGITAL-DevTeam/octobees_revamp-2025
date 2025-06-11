import {
  createBlog,
  deleteBlogById,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "./blog.service.js";
import { parseBlogQuery } from "../../utils/parseBlogQuery.js";
import logger from "../../utils/logger.js";

const getall = async (req, res) => {
  try {
    const filters = parseBlogQuery(req.query);
    const data = await getAllBlogs(filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error("GET / error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getBlogById(id);
    res.status(200).json(data);
  } catch (error) {
    logger.error("GET /:id error:", error);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, content, status, favorite, categoryId, userId } = req.body;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (
      !title?.trim() ||
      !content?.trim() ||
      !status?.trim() ||
      categoryId === undefined ||
      userId === undefined ||
      favorite === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      status: status.trim(),
      favorite: favorite === "true",
      categoryId,
      userId,
      image: req.file.filename,
    };

    await createBlog(blogData);

    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    logger.error("POST / error:", error);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteBlogById(id);
    res.status(200).json({ message: "Delete Blog Successfully" });
  } catch (error) {
    logger.error("DELETE /:id error:", error);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, status, favorite, categoryId } = req.body;

    // Validasi manual basic
    if (
      !title ||
      !content ||
      !status ||
      favorite === undefined ||
      !categoryId
    ) {
      throw new Error("All fields are required");
    }

    const isFavorite = favorite === "true";
    await updateBlog(id, { ...payload, favorite: isFavorite });
    res.status(200).json({ message: "Blog edited successfully" });
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
      payload.image = req.file.filename;
    } else {
      delete payload.image;
    }
    await updateBlog(id, payload);

    res.status(200).json({ message: "Blog edited successfully" });
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
