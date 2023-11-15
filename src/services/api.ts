import axios, { AxiosError } from "axios";
import { AuthTokenError } from "./errors/AuthTokenError";
import Cookies from 'js-cookie';
import { signOut } from "../contexts/AuthContext";

export function setupAPIClient() {
  const token = Cookies.get('auth.token');

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== undefined) {
        signOut()
      } else {
        return Promise.reject(new AuthTokenError())
      }
    }
    return Promise.reject(error)

  })

  return api;
}
