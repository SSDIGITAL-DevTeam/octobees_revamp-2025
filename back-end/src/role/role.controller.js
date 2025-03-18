import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUser,
} from "./role.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, status,search, orderBy } = req.query;

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
    const data = await getAllUsers(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

//Cari data berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = await getUserById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

//Tambah data
router.post("/", async (req, res) => {
  try {
    const { name, email, password, status, role, features } = req.body;
    if (!name || !email || !password || !status || !role) {
      throw new Error("wkwkwkw");
    }

    const payload = req.body;

    await createUser(payload);
    res.status(201).json({ message: "Berhasil menambahkan role" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Hapus data
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await deleteUserById(id);
    res.status(200).json({ message: "Berhasil Menghapus Role" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ubah data - semua kolom harus terisi
router.put("/:id", async (req, res) => {
  try {
    const { name, email, password, status, role, features } = req.body;

    if (!name || !email || !password || !status || !role || !features) {
      throw new Error("Data tidak lengkap");
    }

    await updateUser(id, req.body);
    res.status(200).json({ message: "Berhasil Mengubah Role" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ubah data - hanya kolom yang diisi
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //Buat sebuah kondisi ketika ada kolom yang tidak terisi
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Tidak Ada data yang akan diubah");
    }
    await updateUser(id, req.body);
    res.status(200).json({ message: "Berhasil Mengubah Role" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
