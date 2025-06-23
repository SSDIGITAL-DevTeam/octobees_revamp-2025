import express from "express";
import order from "./order.controller.js";

const endUser = express.Router();
endUser.get("/",order.getall);
endUser.get("/:id",order.getid);
endUser.post("/",  order.create);
// endUser.delete("/:id",order.remove);
// endUser.put("/:id",order.put);
// endUser.patch("/:id",order.patch);

const backOffice = express.Router();
backOffice.get("/",order.getall);
backOffice.get("/:id",order.getid);
backOffice.post("/", order.create);
// backOffice.delete("/:id",order.remove);
// backOffice.put("/:id",order.put);
// backOffice.patch("/:id",order.patch);

export default {
    endUser,
    backOffice
};