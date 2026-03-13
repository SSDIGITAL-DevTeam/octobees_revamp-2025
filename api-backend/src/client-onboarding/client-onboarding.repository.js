import { db } from "../../drizzle/db.js";
import { clientOnboarding } from "../../drizzle/schema.js";
import { count, eq } from "drizzle-orm";
import logger from "../../utils/logger.js";

export const findAllClients = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.clientOnboarding.findMany({
      where,
      orderBy,
      limit,
      offset: skip,
    });

    const totalQuery = db.select({ count: count() }).from(clientOnboarding);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;
    return { datas, total };
  } catch (error) {
    logger.error(`GET client_onboarding / error: ${error.message}`);
    throw new Error("Get all clients unsuccessfully");
  }
};

export const findClientById = async (id) => {
  try {
    return await db.query.clientOnboarding.findFirst({
      where: eq(clientOnboarding.id, id),
    });
  } catch (error) {
    logger.error(`GET client_onboarding /:id error: ${error.message}`);
    throw new Error("Get client by id unsuccessfully");
  }
};

export const findClientByEmail = async (email) => {
  try {
    return await db.query.clientOnboarding.findFirst({
      where: eq(clientOnboarding.email, email),
    });
  } catch (error) {
    logger.error(`GET client_onboarding /email error: ${error.message}`);
    throw new Error("Get client by email unsuccessfully");
  }
};

export const insertClient = async (data) => {
  try {
    await db.insert(clientOnboarding).values(data);
  } catch (error) {
    logger.error(`POST client_onboarding / error: ${error.message}`);
    throw new Error("Insert client unsuccessfully");
  }
};

export const editClient = async (id, data) => {
  try {
    await db.update(clientOnboarding).set(data).where(eq(clientOnboarding.id, id));
  } catch (error) {
    logger.error(`PATCH client_onboarding /:id error: ${error.message}`);
    throw new Error("Edit client unsuccessfully");
  }
};

export const deleteClient = async (id) => {
  try {
    await db.delete(clientOnboarding).where(eq(clientOnboarding.id, id));
  } catch (error) {
    logger.error(`DELETE client_onboarding /:id error: ${error.message}`);
    throw new Error("Delete client unsuccessfully");
  }
};
