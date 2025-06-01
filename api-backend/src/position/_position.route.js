import express from "express";
import position from "./position.controller.js";

const endUser = express.Router();
endUser.get("/",position.getall);
endUser.get("/:id",position.getid);
endUser.post("/",  position.create);
endUser.delete("/:id",position.remove);
endUser.put("/:id",position.put);
endUser.patch("/:id",position.patch);

const backOffice = express.Router();
backOffice.get("/",position.getall);
backOffice.get("/:id",position.getid);
backOffice.post("/", position.create);
backOffice.delete("/:id",position.remove);
backOffice.put("/:id",position.put);
backOffice.patch("/:id",position.patch);

export default {
    endUser,
    backOffice
};