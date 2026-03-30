import express from "express";
import coursePurchase from "./course-purchase.controller.js";
import { uploadImage } from "../middleware/uploadFile.js";

const endUser = express.Router();
endUser.post("/", uploadImage.single("paymentProofUrl"), coursePurchase.submit);

const backOffice = express.Router();
backOffice.get("/", coursePurchase.getall);
backOffice.get("/:id", coursePurchase.getid);
backOffice.patch("/:id/status", coursePurchase.patchStatus);

export default {
    endUser,
    backOffice
};
