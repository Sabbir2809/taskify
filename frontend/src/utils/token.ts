import { AUTH_TOKEN_KEY } from "@/config/constants";
import Cookies from "js-cookie";

export const setToken = (token: string) => Cookies.set(AUTH_TOKEN_KEY, token);

export const removeToken = () => Cookies.remove(AUTH_TOKEN_KEY);

export const getToken = (): string | null =>
  Cookies.get(AUTH_TOKEN_KEY) ?? null;
