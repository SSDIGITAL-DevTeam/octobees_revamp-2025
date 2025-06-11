import express from "express";
import blogcat from "./blog-category.controller.js";

const endUser = express.Router();
endUser.get("/", blogcat.getall);
endUser.get("/:id", blogcat.getid);
endUser.post("/", blogcat.create);
endUser.delete("/:id", blogcat.remove);
endUser.put("/:id", blogcat.put);
endUser.patch("/:id", blogcat.patch);

const backOffice = express.Router();
backOffice.get("/", blogcat.getall);
backOffice.get("/:id", blogcat.getid);
backOffice.post("/", blogcat.create);
backOffice.delete("/:id", blogcat.remove);
backOffice.put("/:id", blogcat.put);
backOffice.patch("/:id", blogcat.patch);

export default {
  endUser,
  backOffice,
};
