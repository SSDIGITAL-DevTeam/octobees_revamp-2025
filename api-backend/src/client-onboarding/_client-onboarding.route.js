import express from "express";
import client from "./client-onboarding.controller.js";

const endUser = express.Router();
endUser.get("/", client.getall);
endUser.post("/", client.create);
endUser.post("/login", client.login);
endUser.get("/:id", client.getid);
endUser.patch("/:id", client.patch);
endUser.delete("/:id", client.remove);
endUser.patch("/:id/agreement", client.agreement);
endUser.patch("/:id/change-password", client.changePassword);

const backOffice = express.Router();
backOffice.get("/", client.getall);
backOffice.get("/:id", client.getid);
backOffice.post("/", client.create);
backOffice.delete("/:id", client.remove);
backOffice.patch("/:id", client.patch);
backOffice.patch("/:id/agreement", client.agreement);

export default {
  endUser,
  backOffice,
};
