import express from "express";
import career from "./career.controller.js";
import { uploadResume } from "../middleware/uploadFile.js";

const endUser = express.Router();
endUser.get("/",career.getall);
endUser.get("/:id",career.getid);
endUser.post("/",uploadResume.single("resume"), career.create);
endUser.delete("/:id",career.remove);
endUser.put("/:id",career.put);
endUser.patch("/:id",career.patch);

const backOffice = express.Router();
backOffice.get("/",career.getall);
backOffice.get("/:id",career.getid);
backOffice.post("/",uploadResume.single("resume"),career.create);
backOffice.delete("/:id",career.remove);
backOffice.put("/:id",career.put);
backOffice.patch("/:id",career.patch);

export default {
    endUser,
    backOffice
};