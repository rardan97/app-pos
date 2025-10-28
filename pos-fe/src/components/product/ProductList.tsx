import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import type { Product } from "@/interface/Product.interface";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
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
            <div>
                <Card className="m-9 p-9">
                    <CardHeader>
                        <CardTitle>Data Product</CardTitle>
                        <CardAction><ProductAdd onSuccess={getListAllProduct}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        {/* DESKTOP TABLE */}
                        <div className="hidden lg:block">
                            <Table className="bg-white overflow-hidden border-2 rounded-lg shadow">
                            <TableHeader className="bg-blue-700 ">
                                <TableRow>
                                <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">ID</TableHead>
                                <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Product Name</TableHead>
                                <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Product Desk</TableHead>
                                <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Product Price</TableHead>
                                <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Product Stock</TableHead>
                                <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Product Category</TableHead>
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
                                paginatedData.map((product) => (
                                    <TableRow key={product.productId}>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{product.productId}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{product.productName}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{product.productDescription}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{product.productPrice}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{product.productStock}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{product.productCategory.categoryName}</TableCell>
                                    <TableCell className="text-center px-6 py-4 text-sm text-gray-700">
                                        <div className="flex justify-end items-center gap-2">
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
                            <p className="text-center text-gray-500">No products found.</p>
                            ) : (
                            paginatedData.map((product) => (
                                <div key={product.productId} className="border rounded p-4 shadow">
                                <div className="mb-2">
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