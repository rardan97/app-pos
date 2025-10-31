import { REST_API_BASE_URL } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { PopularProductRes, PopularTypeOrderRes, SectionCards, TransactionChartRes } from "@/interface/Dashboard.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});


export async function getTotalRevenue(token: string) : Promise<ApiResponse<SectionCards> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<SectionCards>>(`/dashboard/getTotalRevenue`, {
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


export async function getUnitSold(token: string) : Promise<ApiResponse<SectionCards> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<SectionCards>>(`/dashboard/getUnitSold`, {
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


export async function getTransaction(token: string) : Promise<ApiResponse<SectionCards> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<SectionCards>>(`/dashboard/getTransaction`, {
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


export async function getCustomers(token: string) : Promise<ApiResponse<SectionCards> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<SectionCards>>(`/dashboard/getCustomers`, {
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


export async function getPopularProduct(token: string) : Promise<ApiResponse<PopularProductRes[]> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<PopularProductRes[]>>(`/dashboard/getPopularProduct`, {
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


export async function getPopularTypeOrder(token: string) : Promise<ApiResponse<PopularTypeOrderRes[]> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<PopularTypeOrderRes[]>>(`/dashboard/getPopularTypeOrder`, {
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


export async function getTransactionChart(token: string) : Promise<ApiResponse<TransactionChartRes[]> | null>{
    console.log("check token :"+token);
    try{
        const response = await api.get<ApiResponse<TransactionChartRes[]>>(`/dashboard/getTransactionChart`, {
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





