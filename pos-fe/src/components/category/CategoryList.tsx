import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Category } from "@/interface/Category.interface";
import { getListCategories } from "@/api/CategoryApi";
import CategoryAdd from "./CategoryAdd";
import CategoryEdit from "./CategoryEdit";
import CategoryDelete from "./CategoryDelete";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";


export default function CategoryList() {
    const hasFetched = useRef(false);
    const [categorys, setCategorys] = useState<Category[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(categorys.length / itemsPerPage));

    const paginatedData = categorys.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getListAllUser = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        if (!token){
            return;
        }
        try {
            const response = await getListCategories(token);
            if(response && response.data){
                console.log("Success processing data");
                setCategorys(response.data);
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
            getListAllUser();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllUser]);

      useEffect(() => {
        setCurrentPage(1);
    }, [categorys]);

    return (
        <>
            <div>
                <Card className="m-9 p-9">
                    <CardHeader>
                        <CardTitle>Data Category</CardTitle>
                        <CardAction><CategoryAdd onSuccess={getListAllUser}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden lg:block">
                            <Table className="bg-white overflow-hidden border-2 rounded-lg shadow">
                                <TableHeader className="bg-blue-700 ">
                                    <TableRow>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">ID</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Category Name</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Category Desk</TableHead>
                                    <TableHead className="text-center px-6 py-3  text-sm font-semibold text-white ">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-500">
                                        No category found.
                                        </TableCell>
                                    </TableRow>
                                    ) : (
                                paginatedData.map((category) => (
                                    <TableRow key={category.categoryId}>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{category.categoryId}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{category.categoryName}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{category.categoryDescription}</TableCell>
                                    <TableCell className="text-center px-6 py-4 text-sm text-gray-700">
                                        <CategoryEdit onSuccess={getListAllUser} idCat={category.categoryId as number} />
                                        <CategoryDelete onSuccess={getListAllUser} idCat={category.categoryId as number} />
                                    </TableCell>
                                    </TableRow>
                                     ))
                                )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="lg:hidden space-y-4">
                           {paginatedData.length === 0 ? (
                            <p className="text-center text-gray-500">No category found.</p>
                            ) : (
                            paginatedData.map((category) => (
                                <div key={category.categoryId} className="border rounded p-4 shadow">
                                    <div className="mb-2">
                                        <strong>ID:</strong> {category.categoryId}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Category Name:</strong> {category.categoryName}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Description:</strong> {category.categoryDescription}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <CategoryEdit
                                        onSuccess={getListAllUser} idCat={category.categoryId as number}
                                        />
                                        <CategoryDelete
                                        onSuccess={getListAllUser} idCat={category.categoryId as number}
                                        />
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