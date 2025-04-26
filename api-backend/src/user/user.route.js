import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "./user.controller.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.delete("/:id", remove);
router.patch("/:id", update);

export default router;