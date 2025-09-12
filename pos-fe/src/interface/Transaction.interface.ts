


export interface TransactionItemDto {
    productId:string;
    productHarga: string;
    productQty:number;
    subTotalAmount:string;
}

export interface TransactionDto {
    transactionId:string;
    statusCode:number;
    grossAmount:string;
    orderId:string;
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