import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent} from "../ui/card";
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
           <div className="my-9 mx-9">
                <div className="w-full rounded-t-sm bg-[#3674B5] dark:bg-[#010d2b] border-2 text-white p-4">
                    <div className="flex justify-between items-center py-2">
                        <h2 className="font-semibold">Data Category</h2>
                        <CategoryAdd onSuccess={getListAllUser}/>
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
                                    <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Category Name</TableHead>
                                    <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Category Desk</TableHead>
                                    <TableHead className="text-end dark:text-[#b5c2e4] px-6 text-sm font-semibold ">Action</TableHead>
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
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{category.categoryId}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{category.categoryName}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{category.categoryDescription}</TableCell>
                                    <TableCell className="px-1">
                                        <div className="flex justify-end gap-3">
                                            <CategoryEdit onSuccess={getListAllUser} idCat={category.categoryId as number} />
                                            <CategoryDelete onSuccess={getListAllUser} idCat={category.categoryId as number} />
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
                            <p className="text-center text-gray-500  dark:text-[#c8cee0]">No category found.</p>
                            ) : (
                            paginatedData.map((category) => (
                                <div key={category.categoryId} className="border p-6 shadow text-gray-700 dark:bg-[#010d2b] dark:text-[#c8cee0] rounded-lg">
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