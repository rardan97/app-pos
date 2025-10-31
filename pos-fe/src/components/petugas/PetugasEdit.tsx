import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { FaEdit } from "react-icons/fa";
import { getPetugasValueById } from "@/api/PetugasApi";
import { getListRole } from "@/api/RoleApi";
import type { Role } from "@/interface/Role.interface";
import type { PetugasReq } from "@/interface/Petugas.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


type PetugasEditProps = {
    onSuccess: () => void;
    idPetugas: number;
};

 
type OptionRole = {
    value: string;
    label: string;
};


interface Errors {
    petugasFullName: string;
    petugasEmail: string;
    petugasUsername: string;
    petugasPassword: string;
    petugasRoleId: string;
}

export default function PetugasEdit({onSuccess, idPetugas} : PetugasEditProps) {
     const { isOpen, setIsOpen, openModal, closeModal } = useModal();
     const [petugasId, setPetugasId] = useState<number>();    
     const [petugasFullName, setPetugasFullName] = useState<string>("");
         const [petugasEmail, setPetugasEmail] = useState<string>("");
         const [petugasUsername, setPetugasUsername] = useState<string>("");
         const [petugasPassword, setPetugasPassword] = useState<string>("");
         const [petugasRoleId, setPetugasRoleId] = useState<string>("");
         const [petugasRole, setPetugasRole] = useState<Role>();
         const [errorsAll, setErrorsAll] = useState<string>("");
         const [optionsRole, setOptionsRole] = useState<OptionRole[]>([]);
         const [isLoading, setIsLoading] = useState(false);
     
         const hasFetched = useRef(false);
         
         const [errors, setErrors] = useState<Errors>({
             petugasFullName: '',
             petugasEmail: '',
             petugasUsername: '',
             petugasPassword: '',
             petugasRoleId: '',
         });


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

     
     
         const getListAllRole = useCallback(async (): Promise<void> => {
             const token = localStorage.getItem("accessToken");
             console.log(token);
             if (!token){
                 return;
             }
             try {
                 const response = await getListRole(token);
                 if(response && response.data){
                     const mapped = response.data.map((cat) => ({
                     value: cat.rolePetugasId.toString(),
                     label: cat.rolePetugasName,
                 }));
                 setOptionsRole(mapped);
                 }
             } catch (error) {
                 console.log("Failed processing data", error);
                 throw error;
             }
         }, []);
     
            
         useEffect(() => {
             console.log(hasFetched);
             if (!hasFetched.current) {
                 getListAllRole();
                 hasFetched.current = true; // Cegah request kedua
             }
         }, [getListAllRole]);
     
     
         function resetForm() {
             setPetugasFullName("");
             setPetugasEmail("");
             setPetugasUsername("");
             setPetugasPassword("");
             setPetugasRoleId("");
             setErrorsAll("");
             setErrors({
                 petugasFullName: '',
                 petugasEmail: '',
                 petugasUsername: '',
                 petugasPassword: '',
                 petugasRoleId: ''
             });
         }
        
         function validateForm(): boolean{
             console.log("proccess validation");
             let valid = true;
             const errorsCopy = {... errors}
             if(petugasFullName.trim()){
                 errorsCopy.petugasFullName = '';
             }else{
                 errorsCopy.petugasFullName = 'petugasFullName is required';
                 valid = false;
             }
         
             if(petugasEmail.trim()){
                 errorsCopy.petugasEmail = '';
             }else{
                 errorsCopy.petugasEmail = 'petugasEmail is required';
                 valid = false;
             }
             
             if(petugasUsername.trim()){
                 errorsCopy.petugasUsername = '';
             }else{
                 errorsCopy.petugasUsername = 'petugasUsername is required';
                 valid = false;
             }
             if(petugasPassword.trim()){
                 errorsCopy.petugasPassword = '';
             }else{
                 errorsCopy.petugasPassword = 'petugasPassword is required';
                 valid = false;
             }
             
     
             if(petugasRoleId.trim()){
                 errorsCopy.petugasRoleId = '';
             }else{
                 errorsCopy.petugasRoleId = 'role is required';
                 valid = false;
             }
     
             setErrors(errorsCopy);
             return valid;
         }
        
         const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
             e.preventDefault();
             setErrorsAll("");
             setIsLoading(true);
            
             const token = localStorage.getItem("accessToken");
             if (!token) {
                 setErrorsAll("Anda belum login. Silakan login terlebih dahulu.");
                 setIsLoading(false);
                 return;
             }
             
             if (validateForm()) {
                 setIsLoading(true);
                 console.log("Testtt signup ");
                 try {
                     const newPetugasReq: PetugasReq = {
                         petugasFullName,
                         petugasEmail,
                         petugasUsername,
                         petugasPassword,
                         petugasRoleId,
                     };
     
                     console.log("Add Petugas :"+newPetugasReq);
                 
                     const result = await editPetugas(token, newPetugasReq);
                     if(result){
                         console.log("success Add Petugas :", result);
                         resetForm();
                         closeModal();
                         onSuccess();
                     }else{
                         setErrorsAll("Gagal Add Petugas. Cek data Anda");
                     }
                 } catch (err) {
                     console.error("Gagal Add Petugas", err);
                     setErrorsAll("Terjadi kesalahan saat Add Data. Silakan coba lagi.");
                 } finally {
                     setIsLoading(false);
                 }
             }
         };
     

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
          <button  onClick={openModal} className="flex items-center text-sm bg-[#0767b6] hover:bg-[#0878e0] text-white dark:bg-[#064f8a] dark:hover:bg-[#0a62b4] hover:text-white px-5 rounded">  
                                   <FaEdit
                                       className="text-white  hover:text-white rounded cursor-pointer my-1"
                                       size={16}
                                       onClick={openModal}
                                   />
                                   </button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Edit Petugas</DialogTitle>
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
                        id="petugasId" 
                        type="hidden" 
                        value={petugasId ?? ''}
                        onChange={(e) => setPetugasId(Number(e.target.value))}
                    />

                <div className="grid gap-3">
                    <Label htmlFor="petugasFullName">Full Name</Label>
                    <Input 
                        id="petugasFullName" 
                        type="text" 
                        placeholder="Enter your Full Name" 
                        value={petugasFullName}
                        onChange={(e) => setPetugasFullName(e.target.value)} 
                        required 
                    />
                    {errors.petugasFullName && <p className="text-red-500 text-sm">{errors.petugasFullName}</p>}
                </div>
                <div className="grid gap-3">
                        <Label htmlFor="petugasEmail">Email</Label>
                        <Input 
                            id="petugasEmail" 
                            type="petugasEmail" 
                            placeholder="Enter your Email" 
                            value={petugasEmail}
                            onChange={(e) => setPetugasEmail(e.target.value)} 
                            required 
                        />
                        {errors.petugasEmail && <p className="text-red-500 text-sm">{errors.petugasEmail}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="petugasUsername">Username</Label>
                        <Input 
                            id="petugasUsername" 
                            type="text" 
                            placeholder="Enter your Username"
                            value={petugasUsername} 
                            onChange={(e) => setPetugasUsername(e.target.value)} 
                            required 
                        />
                        {errors.petugasUsername && <p className="text-red-500 text-sm">{errors.petugasUsername}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="petugasPassword">Password</Label>
                        <Input 
                            id="petugasPassword" 
                            type="petugasPassword" 
                            placeholder="Enter your Password"
                            value={petugasPassword}
                            onChange={(e) => setPetugasPassword(e.target.value)}  
                            required 
                        />
                        {errors.petugasPassword && <p className="text-red-500 text-sm">{errors.petugasPassword}</p>}
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="petugasRoleId">Category</Label>
                        <Select value={petugasRoleId} onValueChange={(value) => setPetugasRoleId(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {optionsRole.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="bg-[#0767b6] hover:bg-[#0878e0] text-white dark:bg-[#064f8a] dark:hover:bg-[#0a62b4] hover:text-white" type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save changes"}
                    </Button>
            </form>
         </DialogContent>
       </Dialog>
  )
}