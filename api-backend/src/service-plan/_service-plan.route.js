import express from "express";
import plan from "./service-plan.controller.js";

const endUser = express.Router();
endUser.get("/", plan.getall);
endUser.get("/:id", plan.getid);
endUser.post("/", plan.create);
endUser.delete("/:id", plan.remove);
endUser.put("/:id", plan.put);
endUser.patch("/:id", plan.patch);

const backOffice = express.Router();
backOffice.get("/", plan.getall);
backOffice.get("/:id", plan.getid);
backOffice.post("/", plan.create);
backOffice.delete("/:id", plan.remove);
backOffice.put("/:id", plan.put);
backOffice.patch("/:id", plan.patch);

export default {
  endUser,
  backOffice,
};
