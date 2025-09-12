import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { getListPetugas } from "@/api/PetugasApi";
import type { Petugas } from "@/interface/Petugas.interface";
import { Button } from "../ui/button";


export default function PetugasList() {
    const hasFetched = useRef(false);
    const [petugasData, setPetugasData] = useState<Petugas[]>([]);

    const getListAllPetugas = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        if (!token){
            return;
        }
        try {
            const response = await getListPetugas(token);
            console.log("Success processing data");
            setPetugasData(response);
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllPetugas();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllPetugas]);

    return (
        <>
            <div>
                <CardHeader>
                    <CardTitle>Data Petugas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Petugas ID</TableHead>
                            <TableHead>Petugas FullName</TableHead>
                            <TableHead>Petugas Email</TableHead>
                            <TableHead>Petugas Username</TableHead>
                            <TableHead>Petugas Role</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {petugasData
                                .filter((petugas) => petugas.petugasId !== null && petugas.petugasId !== undefined)
                                .map((petugas) => (
                            <TableRow key={petugas.petugasId}>
                            <TableCell className="font-medium">{petugas.petugasId}</TableCell>
                            <TableCell>{petugas.petugasFullName}</TableCell>
                            <TableCell>{petugas.petugasEmail}</TableCell>
                            <TableCell>{petugas.petugasUsername}</TableCell>
                            <TableCell>{petugas.petugasRole}</TableCell>
                            <TableCell className="text-right ">
                                <Button>View</Button>
                                {/* <CategoryEdit onSuccess={getListAllUser} idCat={petugas.petugasId as number} /> */}
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