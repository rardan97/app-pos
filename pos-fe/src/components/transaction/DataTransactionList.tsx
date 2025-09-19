import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import ProductAdd from "./ProductAdd";
// import ProductEdit from "./ProductEdit";
// import ProductDelete from "./ProductDelete";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getDataTransactionListAll } from "@/api/DataTransactionApi";
import type { DataTransactionDto } from "@/interface/DataTransaction.interface";


export default function DataTransactionList() {
    const hasFetched = useRef(false);
    const [transactionData, setTransactionData] = useState<DataTransactionDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(transactionData.length / itemsPerPage);

    const paginatedData = transactionData.slice(
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
            const response = await getDataTransactionListAll(token);   
            if(response && response.data){
                console.log("Success processing data");
                setTransactionData(response.data);
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
    }, [transactionData]);

    return (
        <>
            <div>
                <button>Card</button>
                <button>Table</button>
            </div>
            <div>
                <Card className="m-9 p-9">
                    <CardHeader>
                        <CardTitle>Data Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">#</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Gross Amount</TableHead>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Payment Type</TableHead>
                                    <TableHead>Transaction Status</TableHead>
                                    <TableHead>Transaction Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData
                                    .filter((transactionDataRow) => 
                                        transactionDataRow.transactionId !== null && 
                                        transactionDataRow.transactionId !== undefined
                                    )
                                    .map((transactionDataRow, index) => (
                                <TableRow key={transactionDataRow.transactionId}>
                                    <TableCell className="font-medium">
                                    {
          
                                    (currentPage - 1) * itemsPerPage + index + 1
                                        
                                    }
                                    </TableCell>
                                    <TableCell>{transactionDataRow.transactionId}</TableCell>
                                    <TableCell>{transactionDataRow.orderId}</TableCell>
                                    <TableCell>{transactionDataRow.grossAmount}</TableCell>
                                    <TableCell>{transactionDataRow.currency}</TableCell>
                                    <TableCell>{transactionDataRow.paymentType}</TableCell>
                                    <TableCell>{transactionDataRow.transactionStatus}</TableCell>
                                    <TableCell>{transactionDataRow.transactionTime}</TableCell>
                                    <TableCell className="text-right ">
                                        {/* <ProductEdit onSuccess={getListAllProduct} idProduct={product.productId as number} /> */}
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