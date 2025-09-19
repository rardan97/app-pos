import { REST_API_BASE_URL_AUTH } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { Role } from "@/interface/Role.interface";
import type { SignUpReq, SignUpRes } from "@/interface/SignUp.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL_AUTH,
    withCredentials: true
});

export async function signUpAuth(data: SignUpReq): Promise<ApiResponse<SignUpRes> | null > {
    console.log("data :"+data);
    try{
        const response = await api.post<ApiResponse<SignUpRes>>(`/signup`, data);
        console.log(response);
        return response.data;
    }catch (error){
        console.error("Sign Up failed:", error);
        throw new Error("Sign Up failed");
    }
}

export async function getListRoleAuth() : Promise<ApiResponse<Role[]>>{
    console.log(REST_API_BASE_URL_AUTH);
    try{
        const response = await api.get<ApiResponse<Role[]>>(`/getRoleListAll`, {
            headers: {
                "Content-Type": "application/json"
            },
        });

      
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}