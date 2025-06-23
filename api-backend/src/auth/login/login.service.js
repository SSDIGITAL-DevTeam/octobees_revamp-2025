import jwt from "jsonwebtoken";

import { compare } from "bcryptjs";
import { editUser, findUserByEmail } from "../../user/user.repository.js";
import logger from "../../../utils/logger.js";

export const loginUser = async (data) => {
  try {
    const { email, password: inputPassword } = data;

    let validatedUser = await findUserByEmail(email, "Active");

    if (!validatedUser) {
      throw new Error("Email not found");
    }

    const { password, id, name, role, features } = validatedUser;

    const payload = { id, name, role, email, features };

    const isPassword = await compare(inputPassword, password);
    if (!isPassword) {
      throw new Error("Password does not match");
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await editUser(id, { refreshToken });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message);
  }
};
