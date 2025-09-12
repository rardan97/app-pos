
import type { ApiResponse } from '@/interface/ApiResponse.interface';
import type { CheckoutTransactionRes } from '@/interface/CheckoutTransaction.interface';
import React, { createContext, useContext, useState } from 'react';


interface TransactionContextType {
    transactionData: ApiResponse<CheckoutTransactionRes> | null;
    setTransactionData: (data: ApiResponse<CheckoutTransactionRes>) => void;
    clearTransactionData: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactionData, setTransaction] = useState<ApiResponse<CheckoutTransactionRes> | null>(null);

  const setTransactionData = (data: ApiResponse<CheckoutTransactionRes>) => {
    setTransaction(data);
  };

  const clearTransactionData = () => {
    setTransaction(null);
  };

  return (
    <TransactionContext.Provider value={{ transactionData, setTransactionData, clearTransactionData }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransaction must be used within a TransactionProvider');
  return context;
};