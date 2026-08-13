import express from "express";
import voucherController from "./voucher.controller.js";

const endUser = express.Router();
endUser.get("/", voucherController.getAll);
endUser.get("/:id", voucherController.getById);
endUser.post("/", voucherController.create);
endUser.put("/:id", voucherController.update);
endUser.delete("/:id", voucherController.remove);
endUser.post("/validate", voucherController.validate);

const backOffice = express.Router();
backOffice.get("/", voucherController.getAll);
backOffice.get("/:id", voucherController.getById);
backOffice.post("/", voucherController.create);
backOffice.put("/:id", voucherController.update);
backOffice.delete("/:id", voucherController.remove);

export default {
  endUser,
  backOffice
};
