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
import { delRoleValueById, getRoleValueById } from "@/api/RoleApi";
import { MdDelete } from "react-icons/md";


type RoleDeleteProps = {
    onSuccess: () => void;
    idRole: number;
};

export default function RoleDelete({onSuccess, idRole} : RoleDeleteProps) {
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [rolePetugasId, setRolePetugasId] = useState<number>();  
    const [rolePetugasName, setRolePetugasName] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");

    const getRoleById = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const response = await getRoleValueById(token, idRole);
            if(response && response.data){
                console.log("Success processing data : "+response.data.rolePetugasName);
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

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return;
        }
        
        console.log("success validation");
        try {
            
            if (rolePetugasId === undefined) {
                throw new Error("roleId is undefined");
            }
            
            const result = await delRoleValueById(token, rolePetugasId);
            if(result){
                console.log("success Delete data", result);
                setRolePetugasName("");
                setErrorsAll("");
                closeModal();
                onSuccess();
            }else{
                setErrorsAll("Failed Delete Role");
            }
        } catch (err) {
            console.error("Failed Delete Role", err);
            setErrorsAll("Failed Delete Role");
        }
        

        console.log("Saving changes...");
        closeModal();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <MdDelete
                    className="text-red-500 hover:bg-red-600 hover:text-white p-1 rounded cursor-pointer"
                    size={30}
                    onClick={openModal}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>Delete Role</DialogTitle>
                    <DialogDescription>
                    Delete to your role here. Click save when you&apos;re
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
                            disabled
                        />
                    </div>
                    <Button className="bg-red-700 text-white hover:bg-red-600 hover:text-white" type="submit">Delete</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}