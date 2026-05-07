import express from "express";
import blog from "./blog.controller.js";
import { uploadBlogFiles } from "../middleware/uploadFile.js";

const blogUpload = uploadBlogFiles.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

const endUser = express.Router();
endUser.get("/",blog.getall);
endUser.get("/:id",blog.getid);
endUser.post("/", blogUpload, blog.create);
endUser.delete("/:id",blog.remove);
endUser.put("/:id", blogUpload, blog.put);
endUser.patch("/:id", blogUpload, blog.patch);

const backOffice = express.Router();
backOffice.get("/",blog.getall);
backOffice.get("/:id",blog.getid);
backOffice.post("/", blogUpload, blog.create);
backOffice.delete("/:id",blog.remove);
backOffice.put("/:id", blogUpload, blog.put);
backOffice.patch("/:id", blogUpload, blog.patch);

export default {
    endUser,
    backOffice
};