import express from "express";
import {
  getAllMetas,
  getMetaById,
  createMeta,
  removeMeta,
  updateMeta,
} from "./meta.service.js";
import { z } from "zod";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, orderBy, search, slug } = req.query;

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
      slug,
    };
    const data = await getAllMetas(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let { page = 1, limit = 10, orderBy, search } = req.query;

    const id = req.params.id;

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
    };
    const data = await getMetaById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { page, key, value, content } = req.body;
    if (!page || !key || !value || !content) {
      throw new Error("All fields is required");
    }
    await createMeta(req.body);
    res.status(200).json({ message: "Inserting Meta Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await removeMeta(id);
    res.status(200).json({ message: "Deleting Meta Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { page, key, value, content } = req.body;
    if (!page || !key || !value || !content) {
      throw new Error("All fields is required");
    }
    await updateMeta(id, req.body);
    res.status(200).json({ message: "Updating Meta Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to Update");
    }
    await updateMeta(id, req.body);
    res.status(200).json({ message: "Updating Meta Successfully" });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

export default router;
