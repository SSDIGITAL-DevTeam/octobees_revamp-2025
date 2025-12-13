// src/lib/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // kalau ada API umum
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuthInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper untuk set Authorization header setelah login
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosAuthInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    delete axiosAuthInstance.defaults.headers.common["Authorization"];
  }
};