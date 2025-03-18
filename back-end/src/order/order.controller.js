import express from "express";
import {
  getAllServiceCat,
  getServiceCatById,
  createServiceCat,
  deleteServiceCatById,
  updateServiceCat,
} from "./order.service.js";
import { z } from "zod";
const router = express.Router();
  

//Ambil semua data
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, status, orderBy, search } = req.query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = { page, limit, status, orderBy: orderByParams, search };
    const data = await getAllServiceCat(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Cari data berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getServiceCatById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
{/**
  name: 'Ryan Kusuma',
  email: 'ryan@gmail.com',
  phoneNumber: '+624567567',
  bussiness: 'bahagia',
  message: 'tidak tahu',
  date: 'March 6th, 2025',
  time: '09:00',
  plan: '73028bab-de00-4ed4-b248-b913d1dcb494',
  category: '1a4e5b76-cea0-4fdb-b4d9-d6f0be63e08e',
  amount: 'Rp 620000'
  
  */}

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      bussiness,
      message,
      date,
      time,
      amount,
      categoryId,
      idPlan,
    } = req.body;
    if (
      !name || 
      !amount ||
      !bussiness ||
      !categoryId ||
      !date ||
      !email ||
      !message || 
      !phoneNumber || 
      !idPlan || 
      !time
    ) {
      throw new Error("Data tidak lengkap");
    }
    await createServiceCat(req.body);
    res.status(200).json({ message: "Berhasil Menambahkan Order" });
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
