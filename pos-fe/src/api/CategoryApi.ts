import { REST_API_BASE_URL } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { Category, CategoryDto } from "@/interface/Category.interface";
import axios from "axios";

export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});

export async function getListCategories(token: string) : Promise<ApiResponse<Category[]> | null>{
    console.log("Data Token : "+token);
    try{
        const response = await api.get<ApiResponse<Category[]>>(`/category/getCategoryListAll`, {
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

export async function getCategoryValueById(token: string, id : number) : Promise<ApiResponse<Category> | null>{
    console.log("check token :"+token);
    console.log("check id :"+id);
    try{
        const response = await api.get<ApiResponse<Category>>(`/category/getCategoryFindById/${id}`, {
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


export async function addCategories(token: string, data: CategoryDto) : Promise<Category>{
    console.log("token :"+token);
    console.log("data :"+data);
    try{
        const response = await api.post<Category>(`/category/addCategory`, data, {
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

export async function editCategories(token: string, id : number, data: Category) : Promise<Category>{
    try{
        const response = await api.put<Category>(`/category/updateCategory/${id}`, data, {
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




export async function delCategoryValueById(token: string, id : number) : Promise<string>{
    try{
        const response = await api.delete<string>(`/category/deleteCategoryById/${id}`, {
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