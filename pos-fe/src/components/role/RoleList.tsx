import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent} from "../ui/card";
import type { Role } from "@/interface/Role.interface";
import { getListRole } from "@/api/RoleApi";
import RoleAdd from "./RoleAdd";
import RoleEdit from "./RoleEdit";
import RoleDelete from "./RoleDelete";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export default function RoleList() {
    const hasFetched = useRef(false);
    const [roles, setRoles] = useState<Role[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(roles.length / itemsPerPage));

    const paginatedData = roles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


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
            hasFetched.current = true;
        }
    }, [getListAllUser]);

    return (
        <>
        <div className="my-9 mx-9">
            <div className="w-full bg-blue-600 text-white p-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold">Data Role</h2>
                    <RoleAdd onSuccess={getListAllUser} />
                </div>
            </div>
               <Card className="m-0 bg-transparent rounded-none overflow-hidden shadow-none">
                <CardContent>
                    <div className="hidden lg:block">
                        <Table className="bg-white overflow-hidden border-2 rounded-lg shadow">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-6  text-left text-sm font-semibold ">ID</TableHead>
                                    <TableHead className="px-6  text-left text-sm font-semibold ">Role Name</TableHead>
                                    <TableHead className="px-6  text-left text-sm font-semibold ">Description</TableHead>
                                    <TableHead className="text-end px-6 text-sm font-semibold ">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                
                                {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500">
                                    No Role found.
                                    </TableCell>
                                </TableRow>
                                ) : (
                                paginatedData.map((role) => (
                                    <TableRow key={role.rolePetugasId}>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700">{role.rolePetugasId}</TableCell>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700">{role.rolePetugasName}</TableCell>
                                        <TableCell className="px-6 py-2 text-sm text-gray-700">-</TableCell>
                                        <TableCell className="flex justify-end gap-2 px-6 py-2">
                                            <RoleEdit onSuccess={getListAllUser} idRole={role.rolePetugasId as number} />
                                            <RoleDelete onSuccess={getListAllUser} idRole={role.rolePetugasId as number} />
                                        </TableCell>
                                    </TableRow>
                                     ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="lg:hidden space-y-4">
                        {roles.length === 0 ? (
                            <p className="text-center text-gray-500">No Role found.</p>
                        ) : (
                            roles.map((role) => (
                                <div key={role.rolePetugasId} className="border rounded p-4 shadow">
                                <div className="mb-2">
                                    <strong>ID:</strong> {role.rolePetugasId}
                                </div>
                                <div className="mb-2">
                                    <strong>Role Name:</strong> {role.rolePetugasName}
                                </div>
                                <div className="mb-2">
                                    <strong>Description:</strong> -
                                </div>
                                <div className="flex justify-end gap-2">
                                    <RoleEdit onSuccess={getListAllUser} idRole={role.rolePetugasId as number} />
                                    <RoleDelete onSuccess={getListAllUser} idRole={role.rolePetugasId as number} />
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