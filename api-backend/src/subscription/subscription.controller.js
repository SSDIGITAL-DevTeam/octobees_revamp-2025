import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  removeSubscription,
  updateSubscription,
} from "./subscription.service.js";

const getall = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      orderBy,
      createdAt,
    } = req.query;

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

    const filters = {
      page,
      limit,
      search,
      orderBy: orderByParams,
      createdAt,
    };
    const data = await getAllSubscriptions(filters);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getSubscriptionById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email || !source) {
      throw new Error("Data is required");
    }

    await createSubscription(req.body);

    res.status(201).json({ message: "Subscription created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await removeSubscription(id);
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, source } = req.body;
    if (!email || !source) {
      throw new Error("Data is required");
    }
    await updateSubscription(id, req.body);
    res.status(200).json({ message: "Subscription Updated Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }
    await updateSubscription(id, req.body);
    res.status(200).json({ message: "Subscription Updated Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getall,
  getid,
  create,
  remove,
  put,
  patch,
};
