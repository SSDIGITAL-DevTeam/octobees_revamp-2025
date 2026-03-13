import logger from "../../utils/logger.js";
import {
  createClientOnboarding,
  deleteClientOnboardingById,
  getAllClientOnboarding,
  getClientOnboardingById,
  loginClientOnboarding,
  updateClientAgreementById,
  updateClientOnboarding,
} from "./client-onboarding.service.js";

const getall = async (req, res) => {
  try {
    let { page = 1, limit = 10, search, orderBy } = req.query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = String(orderBy)
        .split(",")
        .map((order) => {
          const [field, dir] = order.split(":");
          return { [field]: dir === "desc" ? "desc" : "asc" };
        });
    }

    const data = await getAllClientOnboarding({
      page,
      limit,
      search,
      orderBy: orderByParams,
    });

    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET client_onboarding / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const data = await getClientOnboardingById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET client_onboarding /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, companyName, email, password } = req.body;

    if (!name || !companyName || !email || !password) {
      throw new Error("Field is required");
    }

    await createClientOnboarding({
      name,
      companyName,
      email,
      password,
      agreementGuideApproved: false,
      agreementProgramCommitment: false,
    });

    res.status(201).json({ message: "Client created successfully" });
  } catch (error) {
    logger.error(`POST client_onboarding / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await deleteClientOnboardingById(req.params.id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    logger.error(`DELETE client_onboarding /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }

    await updateClientOnboarding(id, req.body);
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    logger.error(`PATCH client_onboarding /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email and password are required");

    const data = await loginClientOnboarding({ email, password });
    res.status(200).json(data);
  } catch (error) {
    logger.error(`POST client_onboarding /login error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const agreement = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await updateClientAgreementById(id, req.body || {});
    res.status(200).json(data);
  } catch (error) {
    logger.error(`PATCH client_onboarding /:id/agreement error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getall,
  getid,
  create,
  remove,
  patch,
  login,
  agreement,
};
