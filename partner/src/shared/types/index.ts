import { z } from "zod"

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
})

export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  error?: string
}

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number().min(0),
  totalPages: z.number().min(0),
})

export type Pagination = z.infer<typeof PaginationSchema>

export const PaginatedResponseSchema = z.object({
  items: z.array(z.unknown()),
  pagination: PaginationSchema,
})

export type PaginatedResponse<T> = {
  items: T[]
  pagination: Pagination
}

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "user", "partner", "super_admin"]),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export type User = z.infer<typeof UserSchema>

export const LoginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof RegisterSchema>

export const AffiliateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  code: z.string(),
  commission: z.number(),
  status: z.enum(["active", "inactive", "pending"]),
  createdAt: z.string().or(z.date()),
})

export type Affiliate = z.infer<typeof AffiliateSchema>

export const PartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  createdAt: z.string().or(z.date()),
})

export type Partner = z.infer<typeof PartnerSchema>

export const LeadSchema = z.object({
  id: z.string(),
  partnerId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
})

export type Lead = z.infer<typeof LeadSchema>

export const CommissionSchema = z.object({
  id: z.string(),
  partnerId: z.string(),
  leadId: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "approved", "paid", "rejected"]),
  createdAt: z.string().or(z.date()),
  paidAt: z.string().or(z.date()).optional(),
})

export type Commission = z.infer<typeof CommissionSchema>
