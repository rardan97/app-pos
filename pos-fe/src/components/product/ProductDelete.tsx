import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from "@/hooks/useModal";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { delProductValueById, getProductValueById } from "@/api/ProductApi";


type ProductDeleteProps = {
    onSuccess: () => void;
    idProduct: number;
};

export default function ProductDelete({onSuccess, idProduct} : ProductDeleteProps) {
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [productName, setProductName] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const getProductById = useCallback(async (): Promise<void> => {
            const token = localStorage.getItem("accessToken");
            if (!token){
                return;
            }
            try {
                const response = await getProductValueById(token, idProduct);
                if(response && response.data){
                    console.log("Success processing data");
                    setProductName(response.data.productName);
                }
            } catch (error) {
                console.log("Failed processing data", error);
                throw error;
            }
        }, [idProduct]);
        
        useEffect(() => {
                if (isOpen) {
                    getProductById();
                }
        }, [isOpen, getProductById]);

   
    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorsAll("Anda belum login. Silakan login terlebih dahulu.");
            setIsLoading(false);
            return;
        }
       
        console.log("success validation");
        try {
            if (idProduct === undefined) {
                throw new Error("productById is undefined");
            }
            
            const result = await delProductValueById(token, idProduct);
            if(result){
                console.log("success delete data", result);
                setProductName("");
                setErrorsAll("");
                closeModal();
                onSuccess();
            }else{
                setErrorsAll("Gagal delete produk. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Gagal delete produk", err);
            setErrorsAll("Gagal delete produk. Silakan coba lagi.");
        } finally {
                setIsLoading(false);
            }
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button className="bg-red-700 text-white hover:bg-red-600 hover:text-white" variant="destructive" onClick={openModal}>Delete Product</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                    Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
            </DialogHeader>
            <form className={cn("grid items-start gap-6")} onSubmit={handleDelete}>
                {errorsAll && 
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Gagal Delete produk</AlertTitle>
                        <AlertDescription>
                        {errorsAll}
                        </AlertDescription>
                    </Alert>
                }
                <Input
                    type="hidden" 
                    value={idProduct ?? ''}
                />
                <div className="grid gap-3">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input 
                        id="productName" 
                        type="text" 
                        value={productName}
                        disabled 
                    />
                </div>
                <Button className="bg-red-700 text-white hover:bg-red-600 hover:text-white" type="submit" variant="destructive" disabled={isLoading}>
                    {isLoading ? "Delete..." : "Delete"}
                </Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}