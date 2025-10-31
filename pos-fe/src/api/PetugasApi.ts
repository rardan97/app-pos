import { REST_API_BASE_URL } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { Petugas, PetugasReq, PetugasRes } from "@/interface/Petugas.interface";
import axios from "axios";


export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export async function getListPetugas(token: string) : Promise<ApiResponse<Petugas[]>>{
    console.log("Data Token : "+token);
    try{
        const response = await api.get<ApiResponse<Petugas[]>>(`/datapetugas/getPetugasListAll`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("data return : "+response.data);
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}


export async function getPetugasValueById(token: string, id : number) : Promise<ApiResponse<Petugas>>{
    console.log("check token :"+token);
    console.log("check id :"+id);
    try{
        const response = await api.get<ApiResponse<Petugas>>(`/datapetugas/getPetugasFindById/${id}`, {
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


export async function addPetugas(token: string, data: PetugasReq): Promise<ApiResponse<PetugasRes>> {
    console.log("data :"+data);
    try{
        const response = await api.post<ApiResponse<PetugasRes>>(`/datapetugas/addPetugas`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch (error){
        console.error("Sign Up failed:", error);
        throw new Error("Sign Up failed");
    }
}






