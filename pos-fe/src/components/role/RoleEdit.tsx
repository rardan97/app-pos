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
import { FaEdit } from 'react-icons/fa';


type RoleEditProps = {
    onSuccess: () => void;
    idRole: number;
};


interface Errors {
    rolePetugasName: string;
    rolePetugasDesc: string;
}

export default function RoleEdit({onSuccess, idRole} : RoleEditProps) {
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [rolePetugasId, setRolePetugasId] = useState<number>();  
    const [rolePetugasName, setRolePetugasName] = useState<string>("");
    const [rolePetugasDesc, setRolePetugasDesc] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({
        rolePetugasName: '',
        rolePetugasDesc: ''
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
                setRolePetugasDesc(response.data.rolePetugasDesc);
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
            errorsCopy.rolePetugasName = 'role name is required';
            valid = false;
        }
        if(rolePetugasDesc.trim()){
            errorsCopy.rolePetugasDesc = '';
        }else{
            errorsCopy.rolePetugasDesc = 'role desc is required';
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
                    throw new Error("roleId is undefined");
                }
                const newRole: Role = {
                    rolePetugasId,
                    rolePetugasName,
                    rolePetugasDesc
                };

                const result = await editRole(token, rolePetugasId, newRole);
                if(result){
                    console.log("success update role", result);
                    setRolePetugasName("");
                    setRolePetugasDesc("");
                    setErrorsAll("");
                    closeModal();
                    onSuccess();
                }else{
                    setErrorsAll("Failed update Role");
                }
            } catch (err) {
                console.error("Failed update Role", err);
                setErrorsAll("Failed update Role");
            }
        }

        console.log("Saving changes...");
        closeModal();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <FaEdit
                    className="text-blue-700 hover:bg-blue-500 hover:text-white p-1 rounded cursor-pointer"
                    size={30}
                    onClick={openModal}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                    Make changes to role here. Click save when you&apos;re
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
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input 
                            id="roleName" 
                            type="text" 
                            value={rolePetugasName}
                            onChange={(e) => setRolePetugasName(e.target.value)}
                        />
                        {errors.rolePetugasName && <p className="text-red-500 text-sm">{errors.rolePetugasName}</p>}
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="roleDesc">Role Desc</Label>
                        <Input 
                            id="roleDesc" 
                            type="text" 
                            value={rolePetugasDesc}
                            onChange={(e) => setRolePetugasDesc(e.target.value)}
                        />
                        {errors.rolePetugasDesc && <p className="text-red-500 text-sm">{errors.rolePetugasDesc}</p>}
                    </div>
                    <Button className="bg-blue-700 text-white hover:bg-blue-500 hover:text-white" type="submit">Save changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}