
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useEffect, useRef, useState } from "react";
import type { SignUpReq } from "@/interface/SignUp.interface";
import { getListRoleAuth, signUpAuth } from "@/api/AuthRegisterApi";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

type OptionRole = {
    value: string;
    label: string;
};


interface Errors {
    fullName: string;
    email: string;
    username: string;
    password: string;
    role: string;
}


export default function RegisterForm() {
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const [optionsRole, setOptionsRole] = useState<OptionRole[]>([]);

    const hasFetched = useRef(false);
    
    const [errors, setErrors] = useState<Errors>({
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: '',
    });


    const getListAllRole = useCallback(async (): Promise<void> => {
        
        try {
            const response = await getListRoleAuth();
            if(response && response.data){
                const mapped = response.data.map((cat) => ({
                    value: cat.rolePetugasId.toString(),
                    label: cat.rolePetugasName,
                }));
                setOptionsRole(mapped);
                console.log("Success processing data");
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


    function validateForm(): boolean{
        console.log("proccess validation");
        let valid = true;
        const errorsCopy = {... errors}
        if(fullName.trim()){
            errorsCopy.fullName = '';
        }else{
            errorsCopy.fullName = 'FullName is required';
            valid = false;
        }
    
        if(username.trim()){
            errorsCopy.username = '';
        }else{
            errorsCopy.username = 'Username is required';
            valid = false;
        }
        if(password.trim()){
            errorsCopy.password = '';
        }else{
            errorsCopy.password = 'Password is required';
            valid = false;
        }
        if(email.trim()){
            errorsCopy.email = '';
        }else{
            errorsCopy.email = 'Email is required';
            valid = false;
        }

        if(role.trim()){
            errorsCopy.role = '';
        }else{
            errorsCopy.role = 'role is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (validateForm()) {
            console.log("Testtt signup ");
            try {
                const newSignUp: SignUpReq = {
                    fullName,
                    email,
                    username,
                    password,
                    role
                };

                console.log("register :"+newSignUp);
            
                const result = await signUpAuth(newSignUp);
                if(result){
                    console.log("success add data", result);
                    setFullName("");
                    setEmail("");
                    setUsername("");
                    setPassword("");
                    setRole("");
                    setErrorsAll("");
                }else{
                    setErrorsAll("Login gagal. Cek email/password.");
                }
            } catch (err) {
                console.error("Gagal login", err);
                setErrorsAll("Login gagal. Cek email/password.");
            }
        }

        console.log("Saving changes...");
    };



  return (
    <form onSubmit={handleSave}>
        <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Register to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
            </p>
        </div>

        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert>
                <CheckCircle2Icon />
                <AlertTitle>Success! Your changes have been saved</AlertTitle>
                <AlertDescription>
                This is an alert with icon, title and description.
                </AlertDescription>
            </Alert>
        </div>

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
        
        
                    
        <div className="grid gap-6 mt-5">
            <div className="grid gap-3">
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" type="text" placeholder="Enter your Full Name" onChange={(e) => setFullName(e.target.value)} required />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>
            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} required />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                <Input id="username" type="text" placeholder="Enter your Username" onChange={(e) => setUsername(e.target.value)} required />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div className="grid gap-3">
                <Label htmlFor="email">Password</Label>
                <Input id="password" type="password" placeholder="Enter your Password" onChange={(e) => setPassword(e.target.value)}  required />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="grid gap-3">
                <Label htmlFor="email">Role</Label>
                <Select onValueChange={(value) => setRole(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        {optionsRole.map((role) => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        
            <Button type="submit" className="w-full">
            Register
            </Button>
            
        </div>
        <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
            Sign In
            </a>
        </div>
    </form>
  )
}
