import express from "express";
import category from "./service-category.controller.js";

const endUser = express.Router();
endUser.get("/", category.getall);
endUser.get("/:id", category.getid);
endUser.post("/", category.create);
endUser.delete("/:id", category.remove);
endUser.put("/:id", category.put);
endUser.patch("/:id", category.patch);

const backOffice = express.Router();
backOffice.get("/", category.getall);
backOffice.get("/:id", category.getid);
backOffice.post("/", category.create);
backOffice.delete("/:id", category.remove);
backOffice.put("/:id", category.put);
backOffice.patch("/:id", category.patch);

export default {
  endUser,
  backOffice,
};
