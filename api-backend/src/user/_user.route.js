import express from "express";
import user from "./user.controller.js";

const endUser = express.Router();
endUser.get("/", user.getall);
endUser.get("/:id", user.getid);
endUser.post("/", user.create);
endUser.delete("/:id", user.remove);
endUser.put("/:id", user.put);
endUser.patch("/:id", user.patch);

const backOffice = express.Router();
backOffice.get("/", user.getall);
backOffice.get("/:id", user.getid);
backOffice.post("/", user.create);
backOffice.delete("/:id", user.remove);
backOffice.put("/:id", user.put);
backOffice.patch("/:id", user.patch);

export default {
  endUser,
  backOffice,
};
