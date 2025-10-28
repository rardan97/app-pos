import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import DataTransactionDetail from "./DataTransactionDetail";


export default function DataTransactionList() {
    const hasFetched = useRef(false);
    const [transactionData, setTransactionData] = useState<DataTransactionDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(transactionData.length / itemsPerPage));

    const paginatedData = transactionData.slice(
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
        setCurrentPage(1);
    }, [transactionData]);

    return (
        <>
            <div>
                <Card className="m-9 p-9">
                    <CardHeader>
                        <CardTitle>Data Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className="bg-white overflow-hidden border-2 rounded-lg shadow">
                            <TableHeader className="bg-blue-700 ">
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">#</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Transaction ID</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Gross Amount</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Currency</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Payment Type</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Transaction Status</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Transaction Time</TableHead>
                                    <TableHead className="text-center px-6 py-3  text-sm font-semibold text-white ">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length === 0 ? (
                            <p className="text-center text-gray-500">No products found.</p>
                            ) : (
                            paginatedData.map((transactionDataRow, index) => (
                                <TableRow key={transactionDataRow.transactionId}>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                                    {
                                        (currentPage - 1) * itemsPerPage + index + 1
                                    }
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{transactionDataRow.transactionId}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{transactionDataRow.grossAmount}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{transactionDataRow.currency}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{transactionDataRow.paymentType}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{transactionDataRow.transactionStatus}</TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-700">{transactionDataRow.transactionTime}</TableCell>
                                    <TableCell className="text-center px-6 py-4 text-sm text-gray-700">
                                        <DataTransactionDetail onSuccess={getListAllProduct} idTransactionId={transactionDataRow.transactionId} />
                                    </TableCell>
                                </TableRow>
                                ))
                            )}
                            </TableBody>
                        </Table>
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