import { Transaction } from '@/types/TransactionType';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TransactionContextProps {
  transactions: Transaction[];
  addTransaction: (amount: number | string, account: string) => void;
  balance: number;
}

// Create the context with an initial value
const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(1000);

  const addTransaction = (amount: number | string, account: string) => {
    const transactionAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const newTransaction: Transaction = { id: Date.now(), amount: transactionAmount, account };
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    setBalance((prevBalance) => prevBalance - transactionAmount);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      balance
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
