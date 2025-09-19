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
    const totalPages = Math.ceil(productData.length / itemsPerPage);

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

    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllProduct();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllProduct]);

    useEffect(() => {
        setCurrentPage(1); // Reset ke halaman 1 saat data berubah
    }, [productData]);

    return (
        <>
            <div>
                <button>Card</button>
                <button>Table</button>
            </div>
            <div>
                <Card className="m-9 p-9">
                    <CardHeader>
                        <CardTitle>Data Product</CardTitle>
                        <CardAction><ProductAdd onSuccess={getListAllProduct}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Product ID</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Product Desk</TableHead>
                                    <TableHead>Product Price</TableHead>
                                    <TableHead>Product Stock</TableHead>
                                    <TableHead>Product Category</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData
                                    .filter((product) => 
                                        product.productId !== null && 
                                        product.productId !== undefined
                                    )
                                    .map((product) => (
                                <TableRow key={product.productId}>
                                    <TableCell className="font-medium">{product.productId}</TableCell>
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell>{product.productDescription}</TableCell>
                                    <TableCell>{product.productPrice}</TableCell>
                                    <TableCell>{product.productStock}</TableCell>
                                    <TableCell>{product.productCategory.categoryName}</TableCell>
                                    <TableCell className="text-right ">
                                        <ProductEdit onSuccess={getListAllProduct} idProduct={product.productId as number} />
                                        <ProductDelete onSuccess={getListAllProduct} idProduct={product.productId as number} /> 
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage((prev) => Math.max(prev - 1, 1));
                                            }}
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
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </>
    );
}