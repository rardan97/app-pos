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
import { delCategoryValueById, getCategoryValueById } from "@/api/CategoryApi";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { MdDelete } from "react-icons/md";


type PetugasDeleteProps = {
    onSuccess: () => void;
    idPetugas: number;
};

export default function PetugasDelete({onSuccess, idPetugas} : PetugasDeleteProps) {

    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [categoryId, setCategoryId] = useState<number>();  
    const [categoryName, setCategoryName] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");

    const getCategoryById = useCallback(async (): Promise<void> => {
            const token = localStorage.getItem("accessToken");
            if (!token){
                return;
            }
            try {
                const response = await getCategoryValueById(token, idPetugas);
                console.log("Success processing data");
                if(response && response.data){
                    setCategoryId(response.data.categoryId);
                    setCategoryName(response.data.categoryName);
                }
            } catch (error) {
                console.log("Failed processing data", error);
                throw error;
            }
        }, [idPetugas]);
        
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
            if (categoryId === undefined) {
                throw new Error("categoryId is undefined");
            }
            
            const result = await delCategoryValueById(token, categoryId);
            if(result){
                console.log("success delete category", result);
                setCategoryName("");
                setErrorsAll("");
                closeModal();
                onSuccess();
            }else{
                setErrorsAll("Failed Delete Category");
            }
        } catch (err) {
            console.error("Failed Delete Category", err);
            setErrorsAll("Failed Delete Category");
        }

        console.log("Saving changes...");
        closeModal();
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <button  onClick={openModal} className="flex items-center text-sm bg-[#d10c57] hover:bg-[#ee065f] dark:bg-[#8a0638] dark:hover:bg-[#af0647] text-white  hover:text-white px-5 rounded"> 
                            <MdDelete
                                className="text-white hover:text-white cursor-pointer"
                                size={17}
                                onClick={openModal}
                            />
                        </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" >
            <DialogHeader>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                Delete to your category here. Click Delete when you&apos;re
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
                    value={categoryId ?? ''}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                />

                <div className="grid gap-3">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input 
                        id="categoryName" 
                        type="text" 
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        disabled 
                    />
                </div>
                <Button className="bg-[#d10c57] hover:bg-[#ee065f] dark:bg-[#8a0638] dark:hover:bg-[#af0647] text-white  hover:text-white" type="submit">Delete</Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}