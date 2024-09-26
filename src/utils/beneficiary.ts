import { Beneficiary } from "@/schemas/beneficiarySchema";

export const validateBeneficiaryExist = (beneficiary: Beneficiary, beneficiaries: Beneficiary[]) => {
    return typeof beneficiaries.find(b => b.first_name === beneficiary.first_name && b.last_name === beneficiary.last_name && b.iban === beneficiary.iban) !== 'undefined';
}