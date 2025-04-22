import express from "express";
import {
  getAllServicePlans,
  getServicePlanById,
  createServicePlan,
  deleteServicePlan,
  updateServicePlan,
  patchServicePlan,
} from "./service-plan.controller.js";

const router = express.Router();

router.get("/", getAllServicePlans);
router.get("/:id", getServicePlanById);
router.post("/", createServicePlan);
router.delete("/:id", deleteServicePlan);
router.put("/:id", updateServicePlan);
router.patch("/:id", patchServicePlan);

export default router;
