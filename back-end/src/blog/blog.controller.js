import express from "express";
import {
  createQueue,
  deleteQueueById,
  getAllQueue,
  getQueueById,
  updateQueue,
} from "./blog.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      favorite,
      search,
      orderBy,
      categoryId,
    } = req.query;
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
      status,
      orderBy: orderByParams,
      search,
      favorite,
      categoryId,
    };
    const data = await getAllQueue(filters);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

//Cari data berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getQueueById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Tambah data
router.post("/", async (req, res) => {
  try {
    const { title, content, status, favorite, categoryId, roleId } = req.body;
    // Validasi manual basic
    if (
      !title ||
      !content ||
      !status ||
      favorite === undefined ||
      !categoryId ||
      !roleId
    ) {
      throw new Error("Semua field wajib diisi");
    }

    const isFavorite = favorite === "true";

    // Validasi file gambar
    if (!req.file) {
      throw new Error("Gambar wajib diunggah");
    }

    // Kirim ke service
    await createQueue({
      ...req.body,
      favorite: isFavorite,
      image: req.file.filename,
    });
    res.status(201).json({ message: "Berhasil menambahkan blog" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteQueueById(id);

    res.status(200).json({ message: "Berhasil Menghapus Blog dan Gambar" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ubah data - semua kolom harus terisi
router.put("/:id", async (req, res) => {
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
      throw new Error("Semua field wajib diisi");
    }

    const isFavorite = favorite === "true";
    await updateQueue(id, { ...payload, favorite: isFavorite });
    res.status(200).json({ message: "Berhasil Mengubah Blog" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Ubah data - hanya kolom yang diisi
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Tidak ada data yang akan diubah");
    }
    const payload = { ...req.body };

    if (req.file) {
      payload.image = req.file.filename;
    } else {
      delete payload.image;
    }

    await updateQueue(id, payload);

    res.status(200).json({ message: "Berhasil mengubah blog" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
