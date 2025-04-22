import {
  getAllServicePlan,
  getServiceCatById,
  createServiceCat,
  deleteServiceCatById,
  updateServiceCat,
} from "./service-plan.service.js";
import { z } from "zod";

// Controller for fetching all service plans
export const getAllServicePlanController = async (req, res) => {
  try {
    let { page = 1, limit = 10, search, orderBy, status } = req.query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = { page, limit, orderBy: orderByParams, search, status };
    const data = await getAllServicePlan(filters);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for fetching service plan by ID
export const getServiceCatByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getServiceCatById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for creating a new service plan
export const createServiceCatController = async (req, res) => {
  try {
    const {
      name,
      type,
      prices,
      options,
      descriptions,
      benefits,
      categoryId,
      status,
    } = req.body;
    if (
      !name ||
      !type ||
      prices.length === 0 ||
      !options ||
      !descriptions ||
      !categoryId ||
      !status
    ) {
      throw new Error("Data tidak lengkap");
    }
    await createServiceCat(req.body);
    res.status(200).json({ message: "Berhasil Menambahkan Service Plan" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Controller for deleting a service plan by ID
export const deleteServiceCatByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteServiceCatById(id);
    res.status(200).json({ message: "Berhasil Menghapus Service Plan" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for updating a service plan by ID
export const updateServiceCatController = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      type,
      showPrice,
      prices,
      options,
      descriptions,
      benefits,
      categoryId,
      status,
    } = req.body;
    if (
      !name ||
      !type ||
      !showPrice ||
      !prices ||
      !options ||
      !descriptions ||
      !benefits ||
      !categoryId ||
      !status
    ) {
      throw new Error("Data tidak lengkap");
    }
    await updateServiceCat(id, req.body);
    res.status(200).json({ message: "Berhasil Mengubah Service Plan" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// Controller for partially updating a service plan by ID
export const patchServiceCatController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Tidak Ada data yang akan diubah");
    }
    await updateServiceCat(id, req.body);
    res.status(200).json({ message: "Berhasil Mengubah Service Plan" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};
