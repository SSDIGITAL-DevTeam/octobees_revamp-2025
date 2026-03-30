import {
  getAllCoursePurchases,
  getCoursePurchaseById,
  submitCoursePurchase,
  updateCoursePurchaseStatus,
} from "./course-purchase.service.js";
import logger from "../../utils/logger.js";

const getall = async (req, res) => {
  try {
    let { page = 1, limit = 10, search, orderBy } = req.query;

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      orderBy: orderByParams,
    };

    const data = await getAllCoursePurchases(filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET COURSE PURCHASE / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getCoursePurchaseById(id);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET COURSE PURCHASE /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const submit = async (req, res) => {
  try {
    const { courseId, customerName, customerEmail, customerPhone } = req.body;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Payment proof is required" });
    }

    if (!courseId || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const payload = {
      courseId,
      customerName,
      customerEmail,
      customerPhone,
      paymentProofUrl: req.file.filename,
      status: "PENDING"
    };

    await submitCoursePurchase(payload);
    res.status(201).json({ message: "Course purchase submitted successfully" });
  } catch (error) {
    logger.error(`POST COURSE PURCHASE / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patchStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    await updateCoursePurchaseStatus(id, status);
    res.status(200).json({ message: "Course purchase status updated successfully" });
  } catch (error) {
    logger.error(`PATCH COURSE PURCHASE STATUS /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getall,
  getid,
  submit,
  patchStatus,
};
