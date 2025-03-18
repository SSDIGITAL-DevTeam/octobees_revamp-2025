import express from "express";
import {
  getAllServiceCat,
  getServiceCatById,
  createServiceCat,
  deleteServiceCatById,
  updateServiceCat,
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
      slug
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

router.post("/", async (req, res) => {
  try {
    const { page, key, value, content } = req.body;
    if (!page || !key || !value || !content) {
      throw new Error("Data tidak lengkap");
    }
    await createServiceCat(req.body);
    res.status(200).json({ message: "Berhasil Menambahkan Meta" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

//Hapus data
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteServiceCatById(id);
    res.status(200).json({ message: "Berhasil Menghapus Meta" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ubah data - semua kolom harus terisi
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { page, key, value, content } = req.body;
    if (!page || !key || !value || !content) {
      throw new Error("Data tidak lengkap");
    }
    await updateServiceCat(id, req.body);
    res.status(200).json({ message: "Berhasil Mengubah Meta" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Tidak Ada data yang akan diubah");
    }
    await updateServiceCat(id, req.body);
    res.status(200).json({ message: "Berhasil Mengubah Meta" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;
