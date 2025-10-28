import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils"
// import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from "@/hooks/useModal";
import type { Category } from "@/interface/Category.interface";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { getDataTransactionById } from "@/api/DataTransactionApi";


type DataTransactionDetailProps = {
    onSuccess: () => void;
    idTransactionId: string;
};



export default function DataTransactionDetail({onSuccess, idTransactionId} : DataTransactionDetailProps) {

    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [id, setId] = useState<string>();  
    const [transactionId, setTransactionId] = useState<string>("");
    const [grossAmount, setGrossAmount] = useState<string>("");
    const [currency, setCurrency] = useState<string>("");
    const [orderId, setOrderId] = useState<string>("");
    const [paymentType, setPaymentType] = useState<string>("");
    const [transactionStatus, setTransactionStatus] = useState<string>("");
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [transactionTime, setTransactionTime] = useState<string>("");
    const [petugasId, setPetugasId] = useState<string>("");

    const getTransactionById = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const response = await getDataTransactionById(token, idTransactionId);
            console.log("Success processing data");
              if(response && response.data){
                setId(response.data.Id);
                setTransactionId(response.data.transactionId);
                setGrossAmount(response.data.grossAmount);
                setCurrency(response.data.currency);
                setOrderId(response.data.orderId);
                setPaymentType(response.data.paymentType);
                setTransactionStatus(response.data.transactionStatus);
                setStatusMessage(response.data.statusMessage);
                setTransactionTime(response.data.transactionTime);
                setPetugasId(response.data.petugasId);
              }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, [idTransactionId]);
    
    useEffect(() => {
            if (isOpen) {
                getTransactionById();
            }
    }, [isOpen, getTransactionById]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={openModal}>View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>View Data Transaction</DialogTitle>
                </DialogHeader>
                <div className={cn("grid items-start gap-6")}>
                    
                </div>
            </DialogContent>
        </Dialog>
    )
}