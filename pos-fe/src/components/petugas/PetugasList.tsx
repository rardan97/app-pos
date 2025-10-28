import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getListPetugas } from "@/api/PetugasApi";
import type { Petugas } from "@/interface/Petugas.interface";
import { Button } from "../ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export default function PetugasList() {
    const hasFetched = useRef(false);
    const [petugasData, setPetugasData] = useState<Petugas[]>([]);

     const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(petugasData.length / itemsPerPage));

    const paginatedData = petugasData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


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

     const handlePrevious = (e: React.MouseEvent) => {
        if (currentPage === 1) return;
        e.preventDefault();
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        if (currentPage === totalPages) return;
        e.preventDefault();
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllPetugas();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllPetugas]);

     useEffect(() => {
        setCurrentPage(1);
    }, [petugasData]);

    return (
        <>
            <div>
                <Card className="m-9 p-9">
                    <CardHeader>
                        <CardTitle>Data Petugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="hidden lg:block">
                            <Table className="bg-white overflow-hidden border-2 rounded-lg shadow">
                                <TableHeader className="bg-blue-700 ">
                                    <TableRow>
                                        <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">ID</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Petugas FullName</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Petugas Email</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Petugas Username</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Petugas Role</TableHead>
                                        <TableHead className="text-center px-6 py-3  text-sm font-semibold text-white ">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-gray-500">
                                            No products found.
                                            </TableCell>
                                        </TableRow>
                                        ) : (
                                paginatedData.map((petugas) => (
                                    <TableRow key={petugas.petugasId}>
                                        <TableCell className="px-6 py-4 text-sm text-gray-700">{petugas.petugasId}</TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-700">{petugas.petugasFullName}</TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-700">{petugas.petugasEmail}</TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-700">{petugas.petugasUsername}</TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-700">{petugas.petugasRole}</TableCell>
                                        <TableCell className="text-center px-6 py-4 text-sm text-gray-700">
                                            <Button>View</Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="lg:hidden space-y-4">
                           {paginatedData.length === 0 ? (
                            <p className="text-center text-gray-500">No products found.</p>
                            ) : (
                            paginatedData.map((petugas) => (
                                    <div key={petugas.petugasId} className="border rounded p-4 shadow">
                                    <div className="mb-2">
                                        <strong>ID:</strong> {petugas.petugasId}
                                    </div>
                                    <div className="mb-2">
                                        <strong>FullName:</strong> {petugas.petugasFullName}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Email:</strong> {petugas.petugasEmail}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Username:</strong> {petugas.petugasUsername}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Role:</strong> {petugas.petugasRole}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button>View</Button>
                                    </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4 w-full flex justify-between items-center px-3">
                            <div className="justify-start">
                                <p className="text-sm text-gray-500 mt-2">
                                Page {currentPage} of {totalPages}
                                </p>
                            </div>
                            <div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                href="#" 
                                                onClick={handlePrevious}
                                                aria-disabled={currentPage === 1}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                />
                                        </PaginationItem>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink 
                                                    href="#"
                                                    isActive={currentPage === index + 1}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(index + 1);
                                                    }}
                                                >
                                                {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext 
                                                href="#" 
                                                onClick={handleNext}
                                                aria-disabled={currentPage === totalPages}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                />
                                        </PaginationItem>
                                    </PaginationContent>
                                    
                                </Pagination>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}