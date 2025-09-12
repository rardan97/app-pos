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
import { editRole, getRoleValueById } from "@/api/RoleApi";
import type { Role } from "@/interface/Role.interface";


type RoleEditProps = {
    onSuccess: () => void;
    idRole: number;
};


interface Errors {
    rolePetugasName: string;
}

export default function RoleEdit({onSuccess, idRole} : RoleEditProps) {

    

    const { isOpen, setIsOpen, openModal, closeModal } = useModal();

    const [rolePetugasId, setRolePetugasId] = useState<number>();  
    const [rolePetugasName, setRolePetugasName] = useState<string>("");

    const [errorsAll, setErrorsAll] = useState<string>("");


    const [errors, setErrors] = useState<Errors>({
        rolePetugasName: '',
    });

    const getRoleById = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const response = await getRoleValueById(token, idRole);
            if(response && response.data){
                console.log("Success processing data");
                setRolePetugasId(response.data.rolePetugasId);
                setRolePetugasName(response.data.rolePetugasName);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, [idRole]);
    
    useEffect(() => {
            if (isOpen) {
                getRoleById();
            }
    }, [isOpen, getRoleById]);


    
    function validateForm(): boolean{
        console.log("proccess validation");
        let valid = true;
        const errorsCopy = {... errors}
        if(rolePetugasName.trim()){
            errorsCopy.rolePetugasName = '';
        }else{
            errorsCopy.rolePetugasName = 'email is required';
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
                 if (rolePetugasId === undefined) {
                    throw new Error("categoryId is undefined");
                }
                const newCategory: Role = {
                    rolePetugasId,
                    rolePetugasName,
                };

                
                const result = await editRole(token, rolePetugasId, newCategory);
                if(result){
                    console.log("success add data", result);
                    setRolePetugasName("");
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
        }

        console.log("Saving changes...");
        closeModal();
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
           <Button variant="outline" onClick={openModal}>Edit</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Edit Role</DialogTitle>
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
                        id="rolePetugasId" 
                        type="hidden" 
                        value={rolePetugasId ?? ''}
                        onChange={(e) => setRolePetugasId(Number(e.target.value))}
                    />
            
                <div className="grid gap-3">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input 
                        id="rolePetugasName" 
                        type="text" 
                        value={rolePetugasName}
                        onChange={(e) => setRolePetugasName(e.target.value)}
                    />
                    {errors.rolePetugasName && <p className="text-red-500 text-sm">{errors.rolePetugasName}</p>}
                </div>
                
                <Button type="submit">Save changes</Button>
            </form>
         </DialogContent>
       </Dialog>
  )
}