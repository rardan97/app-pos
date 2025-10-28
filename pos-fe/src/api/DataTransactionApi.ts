import { REST_API_BASE_URL } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { DataTransactionDto } from "@/interface/DataTransaction.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export async function getDataTransactionListAll(token: string) : Promise<ApiResponse<DataTransactionDto[]> | null>{
    console.log("Data Token : "+token);
    try{
        const response = await api.get<ApiResponse<DataTransactionDto[]>>(`/data-transaction/getDataTransactionListAll`, {
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

export async function getDataTransactionById(token: string, id : string) : Promise<ApiResponse<DataTransactionDto> | null>{
    console.log("check token :"+token);
    console.log("check id :"+id);
    try{
        const response = await api.get<ApiResponse<DataTransactionDto>>(`/data-transaction/getDataTransactionById/${id}`, {
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

