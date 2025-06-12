import express from "express";
import meta from "./meta.controller.js";

const endUser = express.Router();
endUser.get("/",meta.getall);
endUser.get("/:id",meta.getid);
endUser.post("/", meta.create);
endUser.delete("/:id",meta.remove);
endUser.put("/:id",meta.put);
endUser.patch("/:id",meta.patch);

const backOffice = express.Router();
backOffice.get("/",meta.getall);
backOffice.get("/:id",meta.getid);
backOffice.post("/",meta.create);
backOffice.delete("/:id",meta.remove);
backOffice.put("/:id",meta.put);
backOffice.patch("/:id",meta.patch);

export default {
    endUser,
    backOffice
};