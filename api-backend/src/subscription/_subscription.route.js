import express from "express";
import subscription from "./subscription.controller.js";

const endUser = express.Router();
endUser.get("/", subscription.getall);
endUser.get("/:id", subscription.getid);
endUser.post("/", subscription.create);
endUser.delete("/:id", subscription.remove);
endUser.put("/:id", subscription.put);
endUser.patch("/:id", subscription.patch);

const backOffice = express.Router();
backOffice.get("/", subscription.getall);
backOffice.get("/:id", subscription.getid);
backOffice.post("/", subscription.create);
backOffice.delete("/:id", subscription.remove);
backOffice.put("/:id", subscription.put);
backOffice.patch("/:id", subscription.patch);

export default {
  endUser,
  backOffice,
};
