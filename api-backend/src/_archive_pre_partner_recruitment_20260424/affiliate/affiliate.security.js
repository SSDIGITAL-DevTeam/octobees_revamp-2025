import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const DEFAULT_PASSWORD_LENGTH = 12;
const BCRYPT_ROUNDS = Number(process.env.AFFILIATE_BCRYPT_COST || process.env.BCRYPT_ROUNDS || 12);

const NUMBERS = "23456789";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const SYMBOLS = "!@$%&*?";

const pick = (source) => source[Math.floor(Math.random() * source.length)];

export const generateTemporaryPassword = (length = DEFAULT_PASSWORD_LENGTH) => {
  const allChars = `${NUMBERS}${LOWER}${UPPER}${SYMBOLS}`;
  const chars = [];
  chars.push(pick(NUMBERS), pick(LOWER), pick(UPPER), pick(SYMBOLS));
  while (chars.length < length) {
    chars.push(pick(allChars));
  }
  return chars.sort(() => 0.5 - Math.random()).join("").slice(0, length);
};

export const validatePasswordStrength = (password = "") => {
  const requirements = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const valid = Object.values(requirements).every(Boolean);
  return { valid, requirements };
};

export const hashPassword = async (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);
export const comparePassword = async (plain, hashed) => bcrypt.compare(plain, hashed);

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const generateOneTimeToken = () => {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
};
