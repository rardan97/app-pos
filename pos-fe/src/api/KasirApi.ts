import axios from "axios";
import type { CheckoutTransactionReq, CheckoutTransactionRes } from "@/interface/CheckoutTransaction.interface";
import { REST_API_BASE_URL } from "@/config";
import type { ApiResponse } from "@/interface/ApiResponse.interface";
import type { TransactionReq, TransactionRes } from "@/interface/Transaction.interface";

export const api = axios.create({
    baseURL: REST_API_BASE_URL,
    withCredentials: true
});


export async function checkoutTransaction(token: string, data: CheckoutTransactionReq) : Promise<ApiResponse<CheckoutTransactionRes>>{
    
    // console.log("token : "+token);
    console.log("dataProductTransaksi : "+data.dataProductTransactions);
    try{
        const response = await api.post<ApiResponse<CheckoutTransactionRes>>(`/order-transaction/createOrderTransaction`, data, {
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }, 
        });

        console.log("Data Res check : "+response.data);
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}


export async function checkoutTransactionStatus(token: string, data: TransactionReq) : Promise<ApiResponse<TransactionRes>>{
    
    // console.log("token : "+token);
    
    try{
        const response = await api.post<ApiResponse<TransactionRes>>(`/order-transaction/createStatusTransaction`, data, {
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }, 
        });

        console.log("Data Res check : "+response.data);
        return response.data;
    }catch(error){
        console.error("Error during user fetch:", error);
        throw new Error("Failed to fetch users");
    }
}
