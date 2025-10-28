interface SnapTransactionResult {
  token: string;
  status_code: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_status: string;
  fraud_status: string;
  status_message: string;
  transaction_time: string;
  expiry_time: string;
  issuer?: string;
  acquirer?: string;
  settlement_time?: string;
}