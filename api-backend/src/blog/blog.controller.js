import {
  createBlog,
  deleteBlogById,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "./blog.service.js";
import { parseBlogQuery } from "../../utils/parseBlogQuery.js";
import logger from "../../utils/logger.js";

const getall = async (req, res) => {
  try {
    const filters = parseBlogQuery(req.query);
    const data = await getAllBlogs(filters);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getid = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.query;
    const data = await getBlogById(id, status);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`GET /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const normaliseSeoEntry = (entry) => {
  if (!entry || typeof entry !== "object") return null;
  const rawKey = entry.key ?? "name";
  const key = String(rawKey).trim() || "name";
  const value = entry.value != null ? String(entry.value).trim() : "";
  return {
    key,
    value,
    content:
      entry.content != null && entry.content !== undefined
        ? String(entry.content).trim()
        : entry.value != null
        ? String(entry.value).trim()
        : "",
  };
};

const parseSeoPayload = (seoRaw) => {
  if (!seoRaw) return [];
  if (Array.isArray(seoRaw)) {
    return seoRaw
      .map(normaliseSeoEntry)
      .filter((item) => item && item.value);
  }
  if (typeof seoRaw === "object") {
    return Object.entries(seoRaw)
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return normaliseSeoEntry({ key, ...value });
        }
        return normaliseSeoEntry({ key, value });
      })
      .filter((item) => item && item.value);
  }
  return [];
};

const validateSeoEntries = (entries) => {
  if (!entries.length) {
    throw new Error("SEO metadata is required");
  }

  const findContent = (value, fallbacks = []) => {
    const candidate = entries.find((item) => item.value === value)?.content?.trim();
    if (candidate) return candidate;
    for (const fallback of fallbacks) {
      const alt = entries.find((item) => item.value === fallback)?.content?.trim();
      if (alt) return alt;
    }
    return "";
  };

  const title = findContent("title");
  const description = findContent("description");
  const keyword = findContent("keyword", ["keywords"]);

  if (!title || !description || !keyword) {
    throw new Error("SEO title, description, and keyword are required");
  }

  if (title.length > 60) throw new Error("SEO title must be 60 characters or fewer");
  if (description.length > 160)
    throw new Error("SEO description must be 160 characters or fewer");
  if (keyword.length > 70)
    throw new Error("SEO keyword must be 70 characters or fewer");
};

const create = async (req, res) => {
  try {
    let { title, content, status, favorite, categoryId, userId, seo } = req.body;
    // Parse seo if sent as JSON string via multipart
    if (typeof seo === "string") {
      try { seo = JSON.parse(seo); } catch (_) { /* ignore parse error */ }
    }

    const seoEntries = parseSeoPayload(seo);
    validateSeoEntries(seoEntries);

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (
      !title?.trim() ||
      !content?.trim() ||
      !status?.trim() ||
      categoryId === undefined ||
      userId === undefined ||
      favorite === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      status: status.trim(),
      favorite: favorite === "true",
      categoryId,
      userId,
      image: req.file.filename,
      seo: seoEntries,
    };

    await createBlog(blogData);

    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteBlogById(id);
    res.status(200).json({ message: "Delete Blog Successfully" });
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const put = async (req, res) => {
  try {
    const id = req.params.id;
    let { title, content, status, favorite, categoryId, userId, seo } = req.body;
    if (typeof seo === "string") {
      try { seo = JSON.parse(seo); } catch (_) { /* ignore */ }
    }

    const seoEntries = parseSeoPayload(seo);
    validateSeoEntries(seoEntries);

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (
      !title?.trim() ||
      !content?.trim() ||
      !status?.trim() ||
      categoryId === undefined ||
      userId === undefined ||
      favorite === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const isFavorite = favorite === "true";
    const payload = {
      title: title.trim(),
      content: content.trim(),
      status: status.trim(),
      favorite: isFavorite,
      categoryId,
      userId,
      image: req.file.filename,
      seo: seoEntries,
    };
    await updateBlog(id, payload);
    res.status(200).json({ message: "Blog edited successfully" });
  } catch (error) {
    logger.error(`PUT /:id error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const patch = async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Nothing to update");
    }

    let payload = { ...req.body };
    if (typeof payload.seo === "string") {
      try { payload.seo = JSON.parse(payload.seo); } catch (_) { /* ignore */ }
    }

    if (payload.seo) {
      const seoEntries = parseSeoPayload(payload.seo);
      validateSeoEntries(seoEntries);
      payload.seo = seoEntries;
    }

    if (req.file) {
      payload.image = req.file.filename;
    } else {
      delete payload.image;
    }
    await updateBlog(id, payload);

    res.status(200).json({ message: "Blog edited successfully" });
  } catch (error) {
    logger.error(`PATCH /:id error: ${error.message}`);
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
