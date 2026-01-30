import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.SERVER_BASE_URL || "http://localhost:8080",
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
