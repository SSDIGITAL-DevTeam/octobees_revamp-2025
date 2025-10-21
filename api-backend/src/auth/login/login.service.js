import jwt from "jsonwebtoken"
import { compare } from "bcryptjs"
import { editUser, findUserByEmail } from "../../user/user.repository.js"

const DEFAULT_BACKOFFICE_FEATURES = [
  "subscription",
  "user",
  "blog",
  "services",
  "career",
  "meta",
]

const FEATURE_ALIAS = {
  meta: "meta",
  users: "user",
  user: "user",
  orders: "order",
  careers: "career",
  career: "career",
  position: "career",
  articles: "blog",
  blog: "blog",
  products: "services",
  services: "services",
  categories: "services",
  subscription: "subscription",
  affiliate: "subscription",
  settings: "meta",
  backoffice: "dashboard",
}

const normalizeFeatures = (rawFeatures) => {
  const collected = new Set()

  const register = (value) => {
    if (!value) return
    const key = String(value).toLowerCase()
    const mapped = FEATURE_ALIAS[key] || key
    if (DEFAULT_BACKOFFICE_FEATURES.includes(mapped)) {
      collected.add(mapped)
    }
  }

  const walk = (value) => {
    if (!value) return

    if (Array.isArray(value)) {
      value.forEach((entry) => walk(entry))
      return
    }

    if (typeof value === "string") {
      register(value)
      return
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([key, val]) => {
        if (val === true || typeof val === "string") {
          register(typeof val === "string" && val.length > 0 ? val : key)
        }
        if (val && typeof val === "object") {
          walk(val)
        }
      })
      return
    }

    if (typeof value === "number" || typeof value === "boolean") {
      if (value) {
        register(value)
      }
    }
  }

  if (typeof rawFeatures === "string") {
    try {
      walk(JSON.parse(rawFeatures))
    } catch (error) {
      rawFeatures
        .split(",")
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0)
        .forEach(register)
    }
  } else {
    walk(rawFeatures)
  }

  return Array.from(collected)
}

export const loginUser = async (data) => {
  try {
    const { email, password: inputPassword } = data

    const validatedUser = await findUserByEmail(email, "Active")

    if (!validatedUser) {
      throw new Error("Email not found")
    }

    const { password, id, name, role, features } = validatedUser

    const normalizedFeatures = normalizeFeatures(features)
    const payloadFeatures =
      normalizedFeatures.length > 0 ? normalizedFeatures : DEFAULT_BACKOFFICE_FEATURES

    const payload = { id, name, role, email, features: payloadFeatures }

    const isPassword = await compare(inputPassword, password)
    if (!isPassword) {
      throw new Error("Password does not match")
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    })

    await editUser(id, { refreshToken })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new Error(error.message)
  }
}
