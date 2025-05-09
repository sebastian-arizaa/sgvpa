import axios from "axios"

export const appAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
})