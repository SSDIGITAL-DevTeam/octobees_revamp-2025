import { axiosInstance } from "@/lib/axios"

export type User = {
  id: string
  name: string
  email: string
  status: "Active" | "NonActive" | "Draft"
  role: string
  features: string[]
  createdAt: string
  updatedAt: string
}

export type UserListResponse = {
  data: User[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    perPage: number
  }
}

export type UserListParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  orderBy?: string
}

export const getUsers = (params: UserListParams = {}) =>
  axiosInstance.get<UserListResponse>("/user", { params })

export const getUserById = (id: string) =>
  axiosInstance.get(`/user/${id}`)

export const createUser = (data: {
  name: string
  email: string
  password: string
  status: string
  role: string
}) =>
  axiosInstance.post("/user", data)

export const updateUser = (id: string, data: Partial<User>) =>
  axiosInstance.patch(`/user/${id}`, data)

export const deleteUser = (id: string) =>
  axiosInstance.delete(`/user/${id}`)
