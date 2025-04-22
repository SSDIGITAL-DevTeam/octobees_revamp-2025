import express from "express";
import * as ServiceCatController from "./service-category.controller.js";

const router = express.Router();

router.get("/", ServiceCatController.getAll);
router.get("/:id", ServiceCatController.getById);
// router.post("/", ServiceCatController.create);
// router.delete("/:id", ServiceCatController.remove);
// router.put("/:id", ServiceCatController.updateAll);
// router.patch("/:id", ServiceCatController.updatePartial);

export default router;