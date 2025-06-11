import express from "express";
import blog from "./blog.controller.js";
import { uploadImage } from "../middleware/uploadFile.js";

const endUser = express.Router();
endUser.get("/",blog.getall);
endUser.get("/:id",blog.getid);
endUser.post("/",uploadImage.single("image"), blog.create);
endUser.delete("/:id",blog.remove);
endUser.put("/:id",uploadImage.single("image"), blog.put);
endUser.patch("/:id",uploadImage.single("image"),blog.patch);

const backOffice = express.Router();
backOffice.get("/",blog.getall);
backOffice.get("/:id",blog.getid);
backOffice.post("/",uploadImage.single("image"),blog.create);
backOffice.delete("/:id",blog.remove);
backOffice.put("/:id",uploadImage.single("image"), blog.put);
backOffice.patch("/:id",uploadImage.single("image"),blog.patch);

export default {
    endUser,
    backOffice
};