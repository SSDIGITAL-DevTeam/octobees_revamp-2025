import express from "express";
import controller from "./insight-lead.controller.js";

const endUser = express.Router();
endUser.post("/", controller.create);

const backOffice = express.Router();
backOffice.get("/", controller.getall);
backOffice.get("/:id", controller.getid);
backOffice.delete("/:id", controller.remove);

export default { endUser, backOffice };
