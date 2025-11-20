import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

interface UserState {
  name: string
  role: string
  id: string
  features: string[]
  setToken: (token: string) => void
  clearUser: () => void
}

const FEATURE_ALIAS: Record<string, string> = {
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
  partnership: "partnership",
}

const ALLOWED_FEATURES = new Set(["subscription", "user", "blog", "services", "career", "meta", "partnership"])

const normalizeFeatures = (value: unknown): string[] => {
  const collected = new Set<string>()

  const register = (input: unknown) => {
    if (!input) return
    const key = String(input).toLowerCase()
    const mapped = FEATURE_ALIAS[key] || key
    if (ALLOWED_FEATURES.has(mapped)) {
      collected.add(mapped)
    }
  }

  const walk = (input: unknown) => {
    if (!input) return

    if (Array.isArray(input)) {
      input.forEach((item) => walk(item))
      return
    }

    if (typeof input === "string") {
      register(input)
      return
    }

    if (typeof input === "object") {
      Object.entries(input as Record<string, unknown>).forEach(([key, val]) => {
        if (val === true || typeof val === "string") {
          register(typeof val === "string" && val ? val : key)
        }
        if (val && typeof val === "object") {
          walk(val)
        }
      })
      return
    }

    if (typeof input === "boolean" || typeof input === "number") {
      if (input) register(input)
    }
  }

  if (typeof value === "string") {
    try {
      walk(JSON.parse(value))
    } catch (_error) {
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach(register)
    }
  } else {
    walk(value)
  }

  return Array.from(collected)
}

export const useAuthStore = create<UserState>((set) => ({
  name: "",
  role: "",
  id: "",
  features: [],

  setToken: (token: string) => {
    const decoded: any = jwtDecode(token)
    set({
      name: decoded.name,
      role: decoded.role,
      id: decoded.id,
      features: normalizeFeatures(decoded.features),
    })
  },

  clearUser: () => {
    sessionStorage.removeItem("token")
    set({ name: "", role: "", id: "", features: [] })
  },
}))