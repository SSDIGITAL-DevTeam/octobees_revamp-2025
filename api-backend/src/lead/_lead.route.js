import express from "express";
import lead from "./lead.controller.js";

const endUser = express.Router();
endUser.get("/", lead.getall);
endUser.get("/:id", lead.getid);
endUser.post("/", lead.create);

const backOffice = express.Router();
backOffice.get("/", lead.getall);
backOffice.get("/:id", lead.getid);
backOffice.post("/", lead.create);
backOffice.delete("/:id", lead.remove);
backOffice.put("/:id", lead.put);
backOffice.patch("/:id", lead.patch);

export default {
    endUser,
    backOffice,
};
