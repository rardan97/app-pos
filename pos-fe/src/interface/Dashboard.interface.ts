export interface SectionCards {
    title: string;
    total: number;
    desc: string;
}

export interface PopularProductRes {
    productId: number;
    productName: string;
    productPrice: number;
    productTotal: number;
}

export interface PopularTypeOrderRes {
    typeOrderId: number;
    typeOrderName: string;
    typeOrderTotal: number;
}

export interface TransactionChartRes {   
    transactionFood: number;
    transactionDrink: number;
    transactionDate: string;
}