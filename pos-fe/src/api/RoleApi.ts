import { REST_API_BASE_URL } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { Role, RoleDto } from "@/interface/Role.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export async function getListRole(token: string) : Promise<ApiResponse<Role[]> | null>{
    try{
        const response = await api.get<ApiResponse<Role[]>>(`${REST_API_BASE_URL}/role/getRoleListAll`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}

export async function addRole(token: string, data: RoleDto) : Promise<Role>{
    try{
        const response = await api.post<Role>(`${REST_API_BASE_URL}/role/addRole`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }, 
        });
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}

export async function editRole(token: string, id : number, data: Role) : Promise<Role>{
    console.log("Check id : "+data.rolePetugasId);
    console.log("Check name: "+data.rolePetugasName);
    try{
        const response = await api.put<Role>(`${REST_API_BASE_URL}/role/updateRole/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }, 
        });
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}


export async function getRoleValueById(token: string, id : number) : Promise<ApiResponse<Role>>{
    try{
        const response = await api.get<ApiResponse<Role>>(`${REST_API_BASE_URL}/role/getRoleFindById/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}

export async function delRoleValueById(token: string, id : number) : Promise<string>{
    try{
        const response = await api.delete<string>(`${REST_API_BASE_URL}/role/deleteRoleById/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("test delete");
        console.log(response);
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}