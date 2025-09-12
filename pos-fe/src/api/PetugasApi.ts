import { REST_API_BASE_URL } from "@/config";
import type { Petugas } from "@/interface/Petugas.interface";
import axios from "axios";


export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export async function getListPetugas(token: string) : Promise<Petugas[]>{
    console.log("Data Token : "+token);
    try{
        const response = await api.get<Petugas[]>(`${REST_API_BASE_URL}/datapetugas/getPetugasListAll`, {
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


export async function getPetugasValueById(token: string, id : number) : Promise<Petugas>{
    console.log("check token :"+token);
    console.log("check id :"+id);
    try{
        const response = await api.get<Petugas>(`${REST_API_BASE_URL}/datapetugas/getPetugasFindById/${id}`, {
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
