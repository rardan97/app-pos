import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import type { Product } from "@/interface/Product.interface";
import { Card, CardContent } from "../ui/card";
import { getListProduct } from "@/api/ProductApi";
import ProductAdd from "./ProductAdd";
import ProductEdit from "./ProductEdit";
import ProductDelete from "./ProductDelete";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import ProductDetail from "./ProductDetail";


export default function ProductList() {
    const hasFetched = useRef(false);
    const [productData, setProductData] = useState<Product[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(productData.length / itemsPerPage));

    const paginatedData = productData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getListAllProduct = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log("accessToken : "+token);
        if (!token){
            return;
        }
        try {
            const response = await getListProduct(token);   
            console.log("data check" +response?.data);
            if(response && response.data){
                console.log("Success processing data");
                setProductData(response.data);
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
            getListAllProduct();
            hasFetched.current = true;
        }
    }, [getListAllProduct]);

    useEffect(() => {
        setCurrentPage(1);
    }, [productData]);

    return (
        <>
            <div className="my-9 mx-9">
                <div className="w-full rounded-t-sm bg-[#3674B5] dark:bg-[#010d2b] border-2 text-white p-4">
                    <div className="flex justify-between items-center py-2">
                        <h2 className="font-semibold">Data Product</h2>
                        <ProductAdd onSuccess={getListAllProduct}/>
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
                                <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Product Name</TableHead>
                                <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Product Desk</TableHead>
                                <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Product Price</TableHead>
                                <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Product Stock</TableHead>
                                <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold ">Product Category</TableHead>
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
                                paginatedData.map((product) => (
                                    <TableRow key={product.productId}>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{product.productId}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{product.productName}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{product.productDescription}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{product.productPrice}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{product.productStock}</TableCell>
                                    <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{product.productCategory.categoryName}</TableCell>
                                    <TableCell className="px-1">
                                        <div className="flex justify-end gap-3">
                                        <ProductDetail
                                            idProduct={product.productId as number}
                                        />
                                        <ProductEdit
                                            onSuccess={getListAllProduct}
                                            idProduct={product.productId as number}
                                        />
                                        <ProductDelete
                                            onSuccess={getListAllProduct}
                                            idProduct={product.productId as number}
                                        />
                                        </div>
                                    </TableCell>
                                    </TableRow>
                                ))
                                )}
                            </TableBody>
                            </Table>
                        </div>

                        {/* MOBILE CARD VERSION */}
                        <div className="lg:hidden space-y-4">
                            {paginatedData.length === 0 ? (
                            <p className="text-center text-gray-500  dark:text-[#c8cee0]">No products found.</p>
                            ) : (
                            paginatedData.map((product) => (
                                <div key={product.productId} className="border p-6 shadow text-gray-700 dark:bg-[#010d2b] dark:text-[#c8cee0] rounded-lg">
                                <div className="mb-2 ">
                                    <strong>ID:</strong> {product.productId}
                                </div>
                                <div className="mb-2">
                                    <strong>Product Name:</strong> {product.productName}
                                </div>
                                <div className="mb-2">
                                    <strong>Description:</strong> {product.productDescription}
                                </div>
                                <div className="mb-2">
                                    <strong>Price:</strong> {product.productPrice}
                                </div>
                                <div className="mb-2">
                                    <strong>Stock:</strong> {product.productStock}
                                </div>
                                <div className="mb-4">
                                    <strong>Category:</strong> {product.productCategory.categoryName}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <ProductDetail
                                    idProduct={product.productId as number}
                                    />

                                    <ProductEdit
                                    onSuccess={getListAllProduct}
                                    idProduct={product.productId as number}
                                    />
                                    <ProductDelete
                                    onSuccess={getListAllProduct}
                                    idProduct={product.productId as number}
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