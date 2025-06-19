import { and, count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { user } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllUsers = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db.select(user).from(user);
    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.limit(limit).offset(skip);

    const totalQuery = db.select({ count: count() }).from(user);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    throw new Error("Error fetching all users");
  }
};

export const findUserById = async (id) => {
  try {
    const data = db.query.user.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
        password: true,
        status: true,
        role: true,
        features: true,
      },
      where: eq(user.id, id),
    });
    return data;
  } catch (error) {
    logger.error(`GET by Id /:id error: ${error.message}`);
    throw new Error("Error fetching user by id");
  }
};

export const findUserByEmail = async (email, status = undefined) => {
  let where = eq(user.email, email);
  if (status !== undefined) {
    where = and(where, eq(user.status, status));
  }
  try {
    const selectedEmail = await db.query.user.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        features: true,
      },
      where,
    });

    return selectedEmail;
  } catch (error) {
    logger.error(`GET by Email / error: ${error.message}`);
    throw new Error("Email not found | Unauthorized");
  }
};

export const findUserByRefreshToken = async (refreshToken) => {
  try {
    const selectedUser = await db.query.user.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        features: true,
      },
      where: eq(user.refreshToken, refreshToken),
    });

    return selectedUser;
  } catch (error) {
    logger.error(`GET by Refresh Token / error: ${error.message}`);
    throw new Error("Error fetching user by refresh token");
  }
};

export const insertUser = async (data) => {
  try {
    await db.insert(user).values(data);
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    throw new Error("Create user unsuccessfully");
  }
};

export const deleteUser = async (id) => {
  try {
    await db.delete(user).where(eq(user.id, id));
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    throw new Error("Delete user unsuccessfully");
  }
};

export const editUser = async (id, data) => {
  try {
    await db.update(user).set(data).where(eq(user.id, id));
  } catch (error) {
    logger.error(`UPDATE /:id error: ${error.message}`);
    throw new Error("Edit user unsuccessfully");
  }
};
