import { getMonday } from "@/helpers/datetime/dateHelper";
import { Transaction } from "@/schemas/transactionSchema";

// Utility function to filter current week transactions
export const filterCurrentWeekTransactions = (transactions: Transaction[]) => {
    const today = new Date();
    const monday = getMonday(today);
    return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.created_at);
        return transactionDate >= monday && transactionDate <= today;
    });
};

// Utility function to filter previous week transactions
export const filterPreviousTransactions = (transactions: Transaction[]) => {
    const today = new Date();
    const monday = getMonday(today);
    return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.created_at);
        return transactionDate < monday;
    });
};

export const formatTransactionCreatedDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};