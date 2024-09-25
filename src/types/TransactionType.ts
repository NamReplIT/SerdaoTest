import { Beneficiary } from "./BeneficiaryType";

// Define the types for transaction and context
interface Transaction {
    id: number;
    amount: number;
    account: Beneficiary;
}

export type { Transaction }