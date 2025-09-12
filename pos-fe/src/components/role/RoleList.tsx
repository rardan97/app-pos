import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Role } from "@/interface/Role.interface";
import { getListRole } from "@/api/RoleApi";
import RoleAdd from "./RoleAdd";
import RoleEdit from "./RoleEdit";
import RoleDelete from "./RoleDelete";


export default function RoleList() {
    const hasFetched = useRef(false);
    const [roles, setRoles] = useState<Role[]>([]);

    const getListAllUser = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        if (!token){
            return;
        }
        try {
            const response = await getListRole(token);
            if(response && response.data){
                console.log("Success processing data");
                setRoles(response.data);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllUser();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllUser]);

    return (
        <>
            <div>
                <CardHeader>
                    <CardTitle>Data Role</CardTitle>
                    <CardAction><RoleAdd onSuccess={getListAllUser}/></CardAction>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Role ID</TableHead>
                            <TableHead>Role Name</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles
                                .filter((role) => role.rolePetugasId !== null && role.rolePetugasId !== undefined)
                                .map((role) => (
                            <TableRow key={role.rolePetugasId}>
                            <TableCell className="font-medium">{role.rolePetugasId}</TableCell>
                            <TableCell>{role.rolePetugasName}</TableCell>
                            <TableCell className="text-right ">
                                <RoleEdit onSuccess={getListAllUser} idRole={role.rolePetugasId as number} />
                                <RoleDelete onSuccess={getListAllUser} idRole={role.rolePetugasId as number} />
                            </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </div>
        </>
    );
}