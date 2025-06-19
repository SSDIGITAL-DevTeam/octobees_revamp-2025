import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUser,
} from "./user.service.js";
import logger from "../../utils/logger.js";

const router = express.Router();

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
      createdAt,
    };
    const data = await getAllUsers(filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET User / error: ${error.message}`);
    res.status(400).json(error);
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await getUserById(id);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET User /:id error: ${error.message}`);
    res.status(400).json(error);
  }
};

const create = async (req, res) => {
  try {
    const { name, email, password, status, role } = req.body;
    if (!name || !email || !password || !status || !role) {
      throw new Error("Field is required");
    }

    const payload = req.body;

    await createUser(payload);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;

    await deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const { name, email, password, status, role, features } = req.body;

    if (!name || !email || !password || !status || !role || !features) {
      throw new Error("Data is incomplete");
    }

    await updateUser(id, req.body);
    res.status(200).json({ message: "User updated successfully" });
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
    await updateUser(id, req.body);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default { getall, getid, create, remove, put, patch };
