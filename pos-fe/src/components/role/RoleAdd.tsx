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
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import type { RoleDto } from "@/interface/Role.interface";
import { addRole } from "@/api/RoleApi";

interface Errors {
    rolePetugasName: string;
}

export default function RoleAdd({ onSuccess }: { onSuccess: () => void }) {

    
    const [rolePetugasName, setRolePetugasName] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");

    
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();

    // const [open, setOpen] = React.useState(false)
//   const isDesktop = useMediaQuery("(min-width: 768px)")

    const [errors, setErrors] = useState<Errors>({
        rolePetugasName: ''
    });
    
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
                const newCategory: RoleDto = {
                    rolePetugasName
                };
            
                const result = await addRole(token, newCategory);
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
           <Button variant="outline" onClick={openModal}>Add Role</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Add Role</DialogTitle>
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
                    <Label htmlFor="categoryName">Role Name</Label>
                    <Input id="categoryName" type="text" onChange={(e) => setRolePetugasName(e.target.value)}/>
                    {errors.rolePetugasName && <p className="text-red-500 text-sm">{errors.rolePetugasName}</p>}
                </div>
               
                <Button type="submit">Save changes</Button>
            </form>
         </DialogContent>
       </Dialog>
  )
}