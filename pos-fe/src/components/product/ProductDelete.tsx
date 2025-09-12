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
    const [productId, setProductId] = useState<number>();  
    const [productName, setProductName] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");

    const getCategoryById = useCallback(async (): Promise<void> => {
            const token = localStorage.getItem("accessToken");
            if (!token){
                return;
            }
            try {
                const response = await getProductValueById(token, idProduct);
                if(response && response.data){
                    console.log("Success processing data");
                    setProductId(response.data.productId);
                    setProductName(response.data.productName);
                }
            } catch (error) {
                console.log("Failed processing data", error);
                throw error;
            }
        }, [idProduct]);
        
        useEffect(() => {
                if (isOpen) {
                    getCategoryById();
                }
        }, [isOpen, getCategoryById]);

   
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return;
        }
       
        console.log("success validation");
        try {
            if (productId === undefined) {
                throw new Error("categoryId is undefined");
            }
            
            const result = await delProductValueById(token, productId);
            if(result){
                console.log("success add data", result);
                setProductName("");
                setErrorsAll("");
                closeModal();
                onSuccess();
            }else{
                setErrorsAll("Login gagal. Cek email/password.");
            }
        } catch (err) {
            console.error("Gagal login", err);
            setErrorsAll("Login gagal. Cek email/password.");
        }

        console.log("Saving changes...");
        closeModal();
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" onClick={openModal}>Delete</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" >
            <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                Make changes to your Product here. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <form className={cn("grid items-start gap-6")} onSubmit={handleSave}>
                {errorsAll && 
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Unable to process your payment.</AlertTitle>
                        <AlertDescription>
                        <p>Please verify your billing information and try again.</p>
                        {errorsAll}
                        </AlertDescription>
                    </Alert>
                }

                <Input 
                    id="categoryId" 
                    type="hidden" 
                    value={productId ?? ''}
                    onChange={(e) => setProductId(Number(e.target.value))}
                />

                <div className="grid gap-3">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input 
                        id="productName" 
                        type="text" 
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled 
                    />
                </div>
                <Button type="submit">Delete</Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}