import express from "express";
import {
  getAllServiceCat,
  getServiceCatById,
} from "./pages.service.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, orderBy, search } = req.query;

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
    const data = await getAllServiceCat(filters);
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
    const data = await getServiceCatById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export default router;
