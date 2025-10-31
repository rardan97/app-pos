import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent } from "../ui/card";
import { getListPetugas } from "@/api/PetugasApi";
import type { Petugas } from "@/interface/Petugas.interface";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import PetugasDetail from "./PetugasDetail";
import PetugasAdd from "./PetugasAdd";
import PetugasEdit from "./PetugasEdit";
import PetugasDelete from "./PetugasDelete";

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
             if(response && response.data){
                console.log("Data : "+response.data);
                console.log("Success processing data");
                setPetugasData(response.data);
            }
            
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
           <div className="my-9 mx-9">
                <div className="w-full rounded-t-sm bg-[#3674B5] dark:bg-[#010d2b] border-2 text-white p-4">
                    
                     <div className="flex justify-between items-center py-2">
                        <h2 className="font-semibold">Data Petugas</h2>
                        <PetugasAdd onSuccess={getListAllPetugas}/>
                    </div>
                </div>
                <Card className="m-0 bg-white rounded-none dark:bg-[#030a1b] overflow-hidden shadow-none rounded-b-sm">
                    <CardContent>
                        {/* DESKTOP TABLE */}
                        <div className="hidden lg:block">
                            <Table className="overflow-hidden border-2 rounded-lg shadow dark:text-se">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">ID</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Petugas FullName</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Petugas Email</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Petugas Username</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Petugas Role</TableHead>
                                        <TableHead className="text-end dark:text-[#b5c2e4] px-6 text-sm font-semibold ">Action</TableHead>
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
                                        <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{petugas.petugasId}</TableCell>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{petugas.petugasFullName}</TableCell>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{petugas.petugasEmail}</TableCell>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{petugas.petugasUsername}</TableCell>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{petugas.petugasRole.rolePetugasName}</TableCell>
                                        <TableCell className="px-1">
                                                <div className="flex justify-end gap-3">
                                                <PetugasDetail idPetugas={petugas.petugasId as number} />
                                                <PetugasEdit
                                                    onSuccess={getListAllPetugas}
                                                   idPetugas={petugas.petugasId as number}
                                                />
                                                {/* <PetugasDelete
                                                    onSuccess={getListAllPetugas}
                                                    idPetugas={petugas.petugasId as number}
                                                /> */}
                                                </div>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="lg:hidden space-y-4">
                           {paginatedData.length === 0 ? (
                            <p className="text-center text-gray-500  dark:text-[#c8cee0]">No petugas found.</p>
                            ) : (
                            paginatedData.map((petugas) => (
                                    <div key={petugas.petugasId} className="border p-6 shadow text-gray-700 dark:bg-[#010d2b] dark:text-[#c8cee0] rounded-lg">
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
                                            <strong>Role:</strong> {petugas.petugasRole.rolePetugasName}
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <PetugasDetail idPetugas={petugas.petugasId as number} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4 w-full flex justify-between items-center px-3 dark:text-[#c8cee0]">
                            <div className="justify-start">
                                <p className="text-sm text-gray-500 mt-2">
                                Page {currentPage} of {totalPages}
                                </p>
                            </div>
                            <div>
                                <Pagination >
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
                                                     className="hover:text-[#aeb7d3]"
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