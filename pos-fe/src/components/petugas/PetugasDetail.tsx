import { useCallback, useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import { FaEye } from 'react-icons/fa6';
import { getPetugasValueById } from "@/api/PetugasApi";
import type { Role } from "@/interface/Role.interface";


type PetugasDetailProps = {
    idPetugas: number;
};

export default function PetugasDetail({idPetugas} : PetugasDetailProps) {
    const { isOpen, setIsOpen, openModal } = useModal();
    const [petugasId, setPetugasId] = useState<number>();
    const [petugasFullName, setPetugasFullName] = useState<string>("");
    const [petugasEmail, setPetugasEmail] = useState<string>("");
    const [petugasUsername, setPetugasUsername] = useState<string>("");
    const [petugasRole, setPetugasRole] = useState<Role>();


    const getPetugas = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const response = await getPetugasValueById(token, idPetugas);
            if(response && response.data){
                console.log("Success processing data");
                setPetugasId(response.data.petugasId);
                setPetugasFullName(response.data.petugasFullName);
                setPetugasEmail(response.data.petugasEmail);
                setPetugasUsername(response.data.petugasUsername);
                setPetugasRole(response.data.petugasRole);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, [idPetugas]);
        
    useEffect(() => {
            if (isOpen) {
                getPetugas();
            }
    }, [isOpen, getPetugas]);


    return (
        <> 
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button  onClick={openModal} className="flex items-center text-sm bg-gray-400 hover:bg-gray-500 text-white  hover:text-white dark:bg-[#50595f] dark:hover:bg-[#8d99a3] px-4 rounded">   
                        <FaEye
                            className="text-white hover:text-white rounded cursor-pointer m-1"
                            size={17}
                            onClick={openModal}
                        />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" >
                    <DialogHeader>
                        <DialogTitle>Detail Petugas</DialogTitle>
                        <DialogDescription>
                            Detail Data Petugas
                        </DialogDescription>
                    </DialogHeader>
                    <div className={cn("grid items-start gap-6")} >
                        
                        <div className="grid gap-3">
                            <Label htmlFor="petugasId">Petugas ID</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {petugasId}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="petugasFullName">Petugas Name</Label>
                            <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {petugasFullName}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="petugasEmail">Petugas Email</Label>
                              <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {petugasEmail}
                             </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="petugasUsername">Petugas Username</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {petugasUsername}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="petugasRole">Petugas Role</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {petugasRole?.rolePetugasName}
                           </div>
                        </div> 
                    </div>
                </DialogContent>
            </Dialog>  
        </>
    );
}