import express from "express";
import page from "./page.controller.js";

const endUser = express.Router();
endUser.get("/",page.getall);
endUser.get("/:id",page.getid);
endUser.post("/", page.create);
endUser.delete("/:id",page.remove);
endUser.put("/:id",page.put);
endUser.patch("/:id",page.patch);

const backOffice = express.Router();
backOffice.get("/",page.getall);
backOffice.get("/:id",page.getid);
backOffice.post("/",page.create);
backOffice.delete("/:id",page.remove);
backOffice.put("/:id",page.put);
backOffice.patch("/:id",page.patch);

export default {
    endUser,
    backOffice
};