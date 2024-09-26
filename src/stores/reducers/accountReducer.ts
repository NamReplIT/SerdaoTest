
import { generateMockBeneficiaryData } from "@/_mocks/generateBeneficiaries";
import { generateMockTransactionData } from "@/_mocks/generateTransactions";
import { Beneficiary } from "@/schemas/beneficiarySchema";
import { Transaction } from "@/schemas/transactionSchema";
import { User } from "@/schemas/userSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AccountState = {
    user: User;
    transactions: Transaction[];
    beneficiaries: { [key: string]: Beneficiary }
};


const initialState: AccountState = {
    user: {
        id: 1,
        first_name: "Nguyen",
        last_name: "Nam",
        balance: 0
    },
    beneficiaries: {},
    transactions: [],
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        seedUser: (state, action: PayloadAction<{ balance: number }>) => {
            state.user.balance = action.payload.balance;
            return state;

        },
        /** Beneficiary */
        seedBeneficiary: (state, action: PayloadAction<AccountState['beneficiaries']>) => {
            state.beneficiaries = action.payload;
            return state;

        },
        createBeneficiary: (state, action: PayloadAction<Beneficiary>) => {
            let creatingBeneficiary = { ...action.payload, id: new Date().getTime() };
            state.beneficiaries[creatingBeneficiary.id] = creatingBeneficiary;
            return state;

        },
        updateBeneficiary: (state, action: PayloadAction<Beneficiary>) => {
            let updatingBeneficiary = state.beneficiaries[action.payload.id];
            if (updatingBeneficiary) {
                updatingBeneficiary = { ...updatingBeneficiary, ...action.payload };
                state.beneficiaries[updatingBeneficiary.id] = updatingBeneficiary;
            }
            return state;
        },
        deleteBeneficiary: (state, action: PayloadAction<Beneficiary>) => {
            let deletingBeneficiary = state.beneficiaries[action.payload.id];
            if (deletingBeneficiary) {
                delete state.beneficiaries[deletingBeneficiary.id];
            }
            return state;
        },
        /**Transaction */
        seedTransaction: (state, action: PayloadAction<Transaction[]>) => {
            state.transactions = action.payload;
            return state;

        },
        createTransaction: (state, action: PayloadAction<Transaction>) => {
            let creatingTransaction = { ...action.payload, id: new Date().getTime(), created_at: new Date().toDateString() };
            state.transactions.push(creatingTransaction)
            state.user.balance -= creatingTransaction.amount;
            return state;

        },
        updateTransaction: (state, action: PayloadAction<Transaction>) => {
            let updatingTransaction = state.transactions.find(tr => tr.id === action.payload.id);
            if (updatingTransaction) {
                let updatingTransactionIndex = state.transactions.findIndex(tr => tr.id === action.payload.id);
                state.user.balance += updatingTransaction?.amount;
                updatingTransaction = { ...updatingTransaction, ...action.payload, updated_at: new Date().toDateString() };
                state.user.balance -= updatingTransaction?.amount;
                state.transactions[updatingTransactionIndex] = updatingTransaction;
            }
            return state;
        },
        deleteTransaction: (state, action: PayloadAction<Transaction>) => {
            let deletingTransaction = state.transactions.find(tr => tr.id === action.payload.id);
            if (deletingTransaction) {
                state.user.balance += deletingTransaction?.amount;
                state.transactions = state.transactions.filter(trans => trans.id !== action.payload.id);
            }
            return state;
        },
    },
});

export const {
    seedUser,
    seedBeneficiary,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    seedTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,

} = accountSlice.actions;

export default accountSlice.reducer;
