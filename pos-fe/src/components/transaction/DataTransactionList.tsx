import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { Card, CardContent} from "../ui/card";
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
            <div className="my-9 mx-9">
                <div className="w-full rounded-t-sm bg-[#3674B5] dark:bg-[#010d2b] border-2 text-white p-4">
                    <div className="flex justify-between items-center py-2">
                        <h2 className="font-semibold">Data Transaction</h2>
                    </div>
                </div>
                <Card className="m-0 bg-white rounded-none dark:bg-[#030a1b] overflow-hidden shadow-none rounded-b-sm">
                    <CardContent>
                        {/* DESKTOP TABLE */}
                        <div className="hidden lg:block">
                            <Table className="overflow-hidden border-2 rounded-lg shadow dark:text-se">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">#</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">Transaction ID</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">Gross Amount</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">Currency</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">Payment Type</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">Transaction Status</TableHead>
                                        <TableHead className="px-6 dark:text-[#b5c2e4] text-left text-sm font-semibold">Transaction Time</TableHead>
                                        <TableHead className="text-end dark:text-[#b5c2e4] px-6 text-sm font-semibold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length === 0 ? (
                                        <p className="text-center text-gray-500">No products found.</p>
                                        ) : (
                                        paginatedData.map((transactionDataRow, index) => (
                                            <TableRow key={transactionDataRow.transactionId}>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">
                                                {
                                                    (currentPage - 1) * itemsPerPage + index + 1
                                                }
                                                </TableCell>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{transactionDataRow.transactionId}</TableCell>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{transactionDataRow.grossAmount}</TableCell>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{transactionDataRow.currency}</TableCell>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{transactionDataRow.paymentType}</TableCell>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{transactionDataRow.transactionStatus}</TableCell>
                                                <TableCell className="px-6 py-2 text-sm text-gray-700 dark:text-[#c8cee0]">{transactionDataRow.transactionTime}</TableCell>
                                                <TableCell className="px-1">
                                                    <div className="flex justify-end gap-3">
                                                        <DataTransactionDetail onSuccess={getListAllProduct} idTransactionId={transactionDataRow.transactionId} />
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
                                                     paginatedData.map((transactionDataRow) => (
                                                         <div key={transactionDataRow.transactionId} className="border p-6 shadow text-gray-700 dark:bg-[#010d2b] dark:text-[#c8cee0] rounded-lg">
                                                         <div className="mb-2 ">
                                                             <strong>ID:</strong> {transactionDataRow.transactionId}
                                                         </div>
                                                         <div className="mb-2">
                                                             <strong>Product Name:</strong> {transactionDataRow.grossAmount}
                                                         </div>
                                                         <div className="mb-2">
                                                             <strong>Description:</strong> {transactionDataRow.currency}
                                                         </div>
                                                         <div className="mb-2">
                                                             <strong>Price:</strong> {transactionDataRow.paymentType}
                                                         </div>
                                                         <div className="mb-2">
                                                             <strong>Stock:</strong> {transactionDataRow.transactionStatus}
                                                         </div>
                                                         <div className="mb-4">
                                                             <strong>Category:</strong> {transactionDataRow.transactionTime}
                                                         </div>
                                                         <div className="flex justify-end gap-2">
                                                             <DataTransactionDetail onSuccess={getListAllProduct} idTransactionId={transactionDataRow.transactionId} />
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