import {
  getAllPages,
  getPageById,
  createPage,
  updatePage,
  removePage,
} from "./page.service.js";

const getall = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy,
      search,
      categoryId,
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
      orderBy: orderByParams,
      search,
      categoryId,
      createdAt,
    };
    const data = await getAllPages(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    let { page = 1, limit = 10, orderBy, search, createdAt } = req.query;

    const id = req.params.id;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.max(parseInt(limit) || 10, 1);

    let orderByParams = [];
    if (orderBy) {
      orderByParams = orderBy.split(",").map((order) => {
        const [field, direction] = order.split(":");
        return { [field]: direction === "desc" ? "desc" : "asc" };
      });
    }

    const filters = {
      page,
      limit,
      orderBy: orderByParams,
      search,
      createdAt,
    };
    const data = await getPageById(id, filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { page } = req.body;
    if (!page) {
      throw new Error("Data is incomplete");
    }
    await createPage(req.body);
    res.status(201).json({ message: "Page created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await removePage(id);
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    const { page, key, value, content } = req.body;
    if (!page || !key || !value || !content) {
      throw new Error("Data is incomplete");
    }
    await updatePage(id, req.body);
    res.status(200).json({ message: "Page updated successfully" });
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
    await updatePage(id, req.body);
    res.status(200).json({ message: "Page updated successfully" });
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
