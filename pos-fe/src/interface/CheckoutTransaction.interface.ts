export interface DataProductTransaksi {
  transaksiId: number;
  transaksiKode: string;
  transaksiTotal: string; // dalam bentuk string, misalnya "10000"
}

export interface CustomerDto {
    customerName: string;
}

export interface DataProductTransaction {
  productId: number;
  productNama: string;
  productHarga: string;
  productQty: string;
  productTotalHarga: string;
}

export interface CheckoutTransactionReq {
  customerDto: CustomerDto;
  dataProductTransactions: DataProductTransaction[];
}




// ============================================


export interface CustomerDetails {
  customerName: string;
}

export interface ItemDetail {
  id: string;
  price: string;
  quantity: string;
  name: string;
}

export interface DataTotalTransaction {
  order_id: string;
  total_amount: string;
}

export interface CheckoutTransactionRes {
  customerDetails: CustomerDetails;
  itemDetails: ItemDetail[];
  dataTotalTransaction: DataTotalTransaction;
  token: string;
}


