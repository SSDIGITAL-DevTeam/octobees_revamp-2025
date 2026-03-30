import express from "express";
import course from "./course.controller.js";
import { uploadImage } from "../middleware/uploadFile.js";

const endUser = express.Router();
endUser.get("/", course.getall);
endUser.get("/:id", course.getid);

const backOffice = express.Router();
backOffice.get("/", course.getall);
backOffice.get("/:id", course.getid);
backOffice.post("/", uploadImage.single("bannerUrl"), course.create); 
backOffice.delete("/:id", course.remove);
backOffice.patch("/:id", uploadImage.single("bannerUrl"), course.patch);

export default {
    endUser,
    backOffice
};
