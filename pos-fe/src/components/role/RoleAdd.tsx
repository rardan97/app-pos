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
import AlertSuccess from "../Alert/AlertSuccess";
import { MdAdd } from 'react-icons/md';

interface Errors {
    rolePetugasName: string;
    rolePetugasDesc: string;
}

export default function RoleAdd({ onSuccess }: { onSuccess: () => void }) { 
    const [rolePetugasName, setRolePetugasName] = useState<string>("");
    const [rolePetugasDesc, setRolePetugasDesc] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [errors, setErrors] = useState<Errors>({
        rolePetugasName: '',
        rolePetugasDesc: '',
    });
    
    function validateForm(): boolean{
        console.log("proccess validation");
        let valid = true;
        const errorsCopy = {... errors}
        if(rolePetugasName.trim()){
            errorsCopy.rolePetugasName = '';
        }else{
            errorsCopy.rolePetugasName = 'role Name is required';
            valid = false;
        }

        if(rolePetugasDesc.trim()){
            errorsCopy.rolePetugasDesc = '';
        }else{
            errorsCopy.rolePetugasDesc = 'role Desc is required';
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
                const newRole: RoleDto = {
                    rolePetugasName,
                    rolePetugasDesc
                };
            
                const result = await addRole(token, newRole);
                if(result){
                    console.log("success create role: ", result);
                    AlertSuccess();
                    setRolePetugasName("");
                    setRolePetugasDesc("");
                    setErrorsAll("");
                    closeModal();
                    onSuccess();
                }else{
                    setErrorsAll("Failed create Role");
                }
            } catch (err) {
                console.error("Failed create Role: ", err);
                setErrorsAll("Failed create Role");
            }
        }

        console.log("Saving changes...");
        closeModal();
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
               <button  onClick={openModal} className="flex items-center gap-2 text-sm bg-green-600 text-white hover:bg-green-500 hover:text-white p-2 rounded">             
                <MdAdd className="text-white hover:text-white rounded cursor-pointer" size={20} />
                Add Role
            </button>
               
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>Add Role</DialogTitle>
                    <DialogDescription>
                    Create to your Role here. Click save when you&apos;re
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
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input 
                            id="roleName" 
                            type="text" 
                            onChange={(e) => setRolePetugasName(e.target.value)}
                        />
                        {errors.rolePetugasName && <p className="text-red-500 text-sm">{errors.rolePetugasName}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="roleDesc">Role Desc</Label>
                        <Input 
                            id="roleDesc" 
                            type="text" 
                            onChange={(e) => setRolePetugasDesc(e.target.value)}
                        />
                        {errors.rolePetugasDesc && <p className="text-red-500 text-sm">{errors.rolePetugasDesc}</p>}
                        
                    </div>
                    <Button className="bg-green-600 text-white hover:bg-green-400 hover:text-white" type="submit">Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}