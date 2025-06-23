import {
  getAllBlogCat,
  getBlogCatById,
  createBlogCat,
  deleteBlogCatById,
  updateBlogCat,
} from "./blog-category.service.js";
import { z } from "zod";

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
    const data = await getAllBlogCat(filters);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.query;
    const filters = { status };
    const data = await getBlogCatById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!name || !status) {
      throw new Error("Data is required");
    }

    await createBlogCat(req.body);

    res.status(201).json({ message: "Blog Category created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteBlogCatById(id);
    res.status(200).json({ message: "Blog Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, status } = req.body;
    if (!name || !status) {
      throw new Error("Data is required");
    }
    await updateBlogCat(id, req.body);
    res.status(200).json({ message: "Blog Category Updated Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }
    await updateBlogCat(id, req.body);
    res.status(200).json({ message: "Blog Category Updated Successfully" });
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
