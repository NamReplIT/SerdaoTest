import { getWeekRange } from '@/helpers/datetime/dateHelper';
import { Transaction } from '@/schemas/transactionSchema';
import { Beneficiary } from '@/schemas/beneficiarySchema';

// Helper function to get random number between two values
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random transaction with a specific date and a given list of beneficiaries
const generateRandomTransaction = (
    id: number,
    date: Date,
    beneficiaries: { [id: number]: Beneficiary }
): Transaction => {
    const beneficiaryIds = Object.keys(beneficiaries);
    const randomBeneficiaryId = Number(beneficiaryIds[getRandomInt(0, beneficiaryIds.length - 1)]);

    return {
        id: id,
        amount: getRandomInt(10, 1000), // Random amount between 10 and 1000
        beneficiary_id: randomBeneficiaryId,
        created_at: date,
        updated_at: date,
    };
};

// Function to generate a list of transactions for a specific week and assign random beneficiaries
const generateTransactionsForWeek = (
    startDate: Date,
    numTransactions: number,
    beneficiaries: { [id: number]: Beneficiary }
): Transaction[] => {
    const { monday, sunday } = getWeekRange(startDate);
    const transactions: Transaction[] = [];

    for (let i = 0; i < numTransactions; i++) {
        const randomDate = new Date(
            monday.getTime() + Math.random() * (sunday.getTime() - monday.getTime())
        );
        const transaction = generateRandomTransaction(i + 1, randomDate, beneficiaries);
        transactions.push(transaction);
    }

    return transactions;
};

// Main function to generate transactions for the current and last week, using the provided beneficiaries
export const generateMockTransactionData = (
    beneficiaries: { [id: number]: Beneficiary }
): { currentWeek: Transaction[], lastWeek: Transaction[] } => {
    const today = new Date();

    // Current week transactions
    const currentWeekTransactions = generateTransactionsForWeek(today, getRandomInt(5, 10), beneficiaries);

    // Last week transactions
    const lastWeekDate = new Date(today);
    lastWeekDate.setDate(today.getDate() - 7); // Move to the same day last week
    const lastWeekTransactions = generateTransactionsForWeek(lastWeekDate, getRandomInt(5, 10), beneficiaries);

    return {
        currentWeek: currentWeekTransactions,
        lastWeek: lastWeekTransactions,
    };
};
