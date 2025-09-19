


export interface TransactionItemDto {
    productId:string;
    productHarga: string;
    productQty:number;
    subTotalAmount:string;
}

export interface TransactionDto {
    transactionId:string;
    statusCode:number;
    currency: string,
    grossAmount:string;
    orderId:string;
    paymentType: string, 
    transactionStatus: string, 
    statusMessage: string, 
    transactionTime: string, 
    settlementTime: string
}

export interface TransactionReq {
    transaction: TransactionDto;
    transactionItemList: TransactionItemDto[];
}


export interface TransactionRes {
    transactionId: string;
    orderId: string;
    status: string;
}