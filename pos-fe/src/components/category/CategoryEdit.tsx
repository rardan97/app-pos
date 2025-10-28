import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils"
// import { useMediaQuery } from "@/hooks/use-media-query"
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
import { editCategories, getCategoryValueById } from "@/api/CategoryApi";
import type { Category } from "@/interface/Category.interface";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";


type CategoryEditProps = {
    onSuccess: () => void;
    idCat: number;
};


interface Errors {
    categoryName: string;
    categoryDescription: string;
}

export default function CategoryEdit({onSuccess, idCat} : CategoryEditProps) {
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [categoryId, setCategoryId] = useState<number>();  
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryDescription, setCategoryDescription] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");

    const [errors, setErrors] = useState<Errors>({
        categoryName: '',
        categoryDescription: ''
    });

    const getCategory = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const response = await getCategoryValueById(token, idCat);
            console.log("Success processing data");
              if(response && response.data){
                setCategoryId(response.data.categoryId);
                setCategoryName(response.data.categoryName);
                setCategoryDescription(response.data.categoryDescription || "");
              }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, [idCat]);
    
    useEffect(() => {
            if (isOpen) {
                getCategory();
            }
    }, [isOpen, getCategory]);


    
    function validateForm(): boolean{
        console.log("proccess validation");
        let valid = true;
        const errorsCopy = {... errors}
        if(categoryName.trim()){
            errorsCopy.categoryName = '';
        }else{
            errorsCopy.categoryName = 'email is required';
            valid = false;
        }
    
        if(categoryDescription.trim()){
            errorsCopy.categoryDescription = '';
        }else{
            errorsCopy.categoryDescription = 'password is required';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return;
        }
        if (validateForm()) {
            console.log("success validation");
            try {
                 if (categoryId === undefined) {
                    throw new Error("categoryId is undefined");
                }
                const newCategory: Category = {
                    categoryId,
                    categoryName,
                    categoryDescription,
                };

                
                const result = await editCategories(token, categoryId, newCategory);
                if(result){
                    console.log("success update category : ", result);
                    setCategoryName("");
                    setCategoryDescription("");
                    setErrorsAll("");
                    closeModal();
                    onSuccess();
                }else{
                    setErrorsAll("Failed update category");
                }
            } catch (err) {
                console.error("Failed update category : ", err);
                setErrorsAll("Failed update category");
            }
        }

        console.log("Saving changes...");
        closeModal();
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
           <Button className="lg:mx-2 bg-blue-700 text-white hover:bg-blue-500 hover:text-white" variant="outline" onClick={openModal}>Edit Category</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Edit Category</DialogTitle>
             <DialogDescription>
               Make changes to your category here. Click save when you&apos;re
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
                    />
                    {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="categoryDescription">Category Deskripsi</Label>
                    <Input 
                        id="categoryDescription" 
                        type="text" 
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}/>
                </div>
                <Button className="bg-blue-700 text-white hover:bg-blue-500 hover:text-white" type="submit">Save changes</Button>
            </form>
         </DialogContent>
       </Dialog>
  )
}