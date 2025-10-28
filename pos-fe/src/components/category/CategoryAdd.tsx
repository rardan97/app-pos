import React, { useState } from "react";
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
import { addCategories } from "@/api/CategoryApi";
import type { CategoryDto } from "@/interface/Category.interface";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";


interface Errors {
    categoryName: string;
    categoryDescription: string;
}

export default function CategoryAdd({ onSuccess }: { onSuccess: () => void }) {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryDescription, setCategoryDescription] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [errors, setErrors] = useState<Errors>({
        categoryName: '',
        categoryDescription: ''
    });
    
    function validateForm(): boolean{
        console.log("proccess validation");
        let valid = true;
        const errorsCopy = {... errors}
        if(categoryName.trim()){
            errorsCopy.categoryName = '';
        }else{
            errorsCopy.categoryName = 'name is required';
            valid = false;
        }
    
        if(categoryDescription.trim()){
            errorsCopy.categoryDescription = '';
        }else{
            errorsCopy.categoryDescription = 'description is required';
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
                const newCategory: CategoryDto = {
                    categoryName,
                    categoryDescription,
                };
            
                const result = await addCategories(token, newCategory);
                if(result){
                    console.log("success create category : ", result);
                    setCategoryName("");
                    setCategoryDescription("");
                    setErrorsAll("");
                    closeModal();
                    onSuccess();
                }else{
                    setErrorsAll("Failed create category");
                }
            } catch (err) {
                console.error("Failed create category : ", err);
                setErrorsAll("Failed create category");
            }
        }

        console.log("Saving changes...");
        closeModal();
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
           <Button className="bg-green-600 text-white hover:bg-green-400 hover:text-white" variant="outline" onClick={openModal}>Add Category</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Add Category</DialogTitle>
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
            
                <div className="grid gap-3">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input id="categoryName" type="text" onChange={(e) => setCategoryName(e.target.value)}/>
                    {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="categoryDescription">Category Deskripsi</Label>
                    <Input id="categoryDescription" type="text" onChange={(e) => setCategoryDescription(e.target.value)}/>
                </div>
                <Button className="bg-green-600 text-white hover:bg-green-400 hover:text-white" type="submit">Save changes</Button>
            </form>
         </DialogContent>
       </Dialog>
  )
}