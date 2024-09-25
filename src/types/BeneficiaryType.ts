// Define the types for transaction and context
interface Beneficiary {
    id: number;
    first_name: string;
    last_name: string;
    iban: string;
}

export type { Beneficiary }