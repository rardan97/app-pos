import { REST_API_BASE_URL_AUTH } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { SignInReq, SignInRes } from "@/interface/SignIn.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL_AUTH,
    withCredentials: true
});


export async function signInAuth(data: SignInReq): Promise<ApiResponse<SignInRes> | null> {
  try {
    const response = await api.post<ApiResponse<SignInRes>>(`/signin`, data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
}