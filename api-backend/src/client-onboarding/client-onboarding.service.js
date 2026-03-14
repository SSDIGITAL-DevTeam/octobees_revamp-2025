import { and, asc, desc, like, or } from "drizzle-orm";
import { compare, genSalt, hash } from "bcryptjs";
import { clientOnboarding } from "../../drizzle/schema.js";
import {
  deleteClient,
  editClient,
  findAllClients,
  findClientByEmail,
  findClientById,
  insertClient,
} from "./client-onboarding.repository.js";

const sanitizeClient = (client) => {
  if (!client) return null;
  const { password, ...safeClient } = client;
  return safeClient;
};

const encryptPassword = async (password) => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const getAllClientOnboarding = async (filters) => {
  const { page = 1, limit = 10, search, orderBy } = filters;
  const skip = (page - 1) * limit;

  const whereConditions = [];
  if (search) {
    const keyword = `%${search.toLowerCase()}%`;
    whereConditions.push(
      or(
        like(clientOnboarding.name, keyword),
        like(clientOnboarding.companyName, keyword),
        like(clientOnboarding.email, keyword),
      ),
    );
  }

  const where = whereConditions.length ? and(...whereConditions) : undefined;
  const order = (orderBy || []).map((item) => {
    const field = Object.keys(item)[0];
    const direction = item[field];
    return direction === "desc" ? desc(clientOnboarding[field]) : asc(clientOnboarding[field]);
  });

  const { datas, total } = await findAllClients(skip, limit, where, order);
  return {
    data: datas.map(sanitizeClient),
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      perPage: limit,
    },
  };
};

export const getClientOnboardingById = async (id) => {
  const data = await findClientById(id);
  if (!data) throw new Error("Client not found");
  return sanitizeClient(data);
};

export const createClientOnboarding = async (payload) => {
  const isEmailExist = await findClientByEmail(payload.email);
  if (isEmailExist) throw new Error("Email already exists");

  const encrypted = await encryptPassword(payload.password);
  await insertClient({
    ...payload,
    password: encrypted,
  });
};

export const updateClientOnboarding = async (id, payload) => {
  const existing = await findClientById(id);
  if (!existing) throw new Error("Client not found");

  if (payload.email && payload.email !== existing.email) {
    const isEmailExist = await findClientByEmail(payload.email);
    if (isEmailExist) throw new Error("Email already exists");
  }

  const nextPayload = { ...payload };
  delete nextPayload.agreementGuideApproved;
  delete nextPayload.agreementProgramCommitment;

  if (payload.password) {
    nextPayload.password = await encryptPassword(payload.password);
  } else {
    delete nextPayload.password;
  }

  await editClient(id, nextPayload);
};

export const deleteClientOnboardingById = async (id) => {
  const existing = await findClientById(id);
  if (!existing) throw new Error("Client not found");
  await deleteClient(id);
};

export const loginClientOnboarding = async ({ email, password }) => {
  const existing = await findClientByEmail(email);
  if (!existing) throw new Error("Invalid email or password");

  const isMatch = await compare(password, existing.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return sanitizeClient(existing);
};

export const updateClientAgreementById = async (id, payload) => {
  const existing = await findClientById(id);
  if (!existing) throw new Error("Client not found");

  const nextGuide =
    existing.agreementGuideApproved || Boolean(payload.agreementGuideApproved);
  const nextCommitment =
    existing.agreementProgramCommitment || Boolean(payload.agreementProgramCommitment);

  await editClient(id, {
    agreementGuideApproved: nextGuide,
    agreementProgramCommitment: nextCommitment,
  });

  const updated = await findClientById(id);
  return sanitizeClient(updated);
};
