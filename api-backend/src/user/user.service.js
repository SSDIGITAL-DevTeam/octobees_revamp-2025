import { compare, genSalt, hash } from "bcryptjs";
import {
  deleteUser,
  editUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  insertUser,
} from "./user.repository.js";
import { user } from "../../drizzle/schema.js";
import { and, asc, desc, eq, gte, is, like, or } from "drizzle-orm";
import dayjs from "dayjs";

export const encryptPassword = async (password) => {
  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);
  return hashPassword;
};

export const getAllUsers = async (filters) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      orderBy,
      search,
      createdAt,
    } = filters;

    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (status !== undefined) whereConditions.push(eq(user.status, status));

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(user.name, keyword),
        like(user.status, keyword),
        like(user.email, keyword),
        like(user.features, keyword),
        like(user.role, keyword),
      ];

      whereConditions.push(or(...searchFilters));
    }

    if (createdAt) {
      let dateFrom;
      const now = dayjs();

      switch (createdAt) {
        case "today":
          dateFrom = now.startOf("day").toDate();
          break;
        case "week":
          dateFrom = now.startOf("week").toDate();
          break;
        case "month":
          dateFrom = now.startOf("month").toDate();
          break;
        case "year":
          dateFrom = now.startOf("year").toDate();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        whereConditions.push(gte(user.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(user[field]) : asc(user[field]);
    });
    const { datas, total } = await findAllUsers(skip, limit, where, order);

    const totalPages = Math.ceil(total / limit);
    return {
      data: datas,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getUserById = async (id) => {
  try {
    const _user = await findUserById(id);
    if (!_user) {
      throw new Error("User is not found");
    }
    return _user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createUser = async (payload) => {
  try {
    const { email, password } = payload;
    const validatedEmail = await findUserByEmail(email);
    if (validatedEmail) {
      throw new Error("Email already in use");
    }
    const hashPassword = await encryptPassword(password);
    const user = await insertUser({
      ...payload,
      password: hashPassword,
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUserById = async (id) => {
  try {
    const _user = await getUserById(id);
    if (!_user) {
      throw new Error("User is not found");
    }
    await deleteUser(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (id, payload) => {
  try {
    const { password, newPassword, email, ...rest } = payload;
    const _user = await findUserById(id);
    if (!_user) {
      throw new Error("User not found");
    }

    if (email && email !== _user.email) {
      const isEmailExists = await findUserByEmail(email);
      if (isEmailExists) {
        throw new Error("Email already in use");
      }
    }

    if (newPassword && !password) {
      throw new Error("Old password is required to set new password");
    }

    if (newPassword && password) {
      const isMatch = await compare(password, _user.password);
      if (!isMatch) throw new Error("Password does not match");
      const hashPassword = await encryptPassword(newPassword);
      return await editUser(id, { ...rest, email, password: hashPassword });
    }

    return await editUser(id, { ...rest, email });

  } catch (error) {
    throw new Error(error.message);
  }
};
