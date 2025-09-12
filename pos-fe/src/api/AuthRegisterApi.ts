import { REST_API_BASE_URL_AUTH } from "@/config";
import type { Role } from "@/interface/Role.interface";
import type { SignUpReq, SignUpRes } from "@/interface/SignUp.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL_AUTH,
    withCredentials: true
});

export async function signUpAuth(data: SignUpReq): Promise<{ data: SignUpRes | null }> {
    console.log("data :"+data);
    try{
        const response = await axios.post<SignUpRes>(`${REST_API_BASE_URL_AUTH}/signup`, data);
        console.log(response);
        return { data: response.data };
    }catch (error){
        console.error("Login failed:", error);
        return { data: null };
    }
}

export async function getListRoleAuth() : Promise<Role[]>{
    console.log(REST_API_BASE_URL_AUTH);
    try{
        const response = await api.get<Role[]>(`${REST_API_BASE_URL_AUTH}/getRoleListAll`, {
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