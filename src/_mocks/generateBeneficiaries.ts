import { Beneficiary } from '@/schemas/beneficiarySchema';
import * as yup from 'yup';

// IBAN example for demonstration (not real)
const sampleIbans = [
    'GB33BUKB20201555555555',
    'FR7630006000011234567890189',
    'DE89370400440532013000',
    'ES9121000418450200051332',
    'IT60X0542811101000000123456',
];

// Helper function to generate random integers between two values
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get a random IBAN from the sample IBANs
const getRandomIban = (): string => {
    return sampleIbans[getRandomInt(0, sampleIbans.length - 1)];
};

// Function to generate a random Beneficiary
const generateRandomBeneficiary = (id: number): Beneficiary => {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'];

    return {
        id,
        first_name: firstNames[getRandomInt(0, firstNames.length - 1)],
        last_name: lastNames[getRandomInt(0, lastNames.length - 1)],
        iban: getRandomIban(),
    };
};

// Function to generate seed data for beneficiaries
export const generateMockBeneficiaryData = (num: number): { [id: number]: Beneficiary } => {
    const beneficiaries: { [id: number]: Beneficiary } = {};

    for (let i = 1; i <= num; i++) {
        const beneficiary = generateRandomBeneficiary(i);
        beneficiaries[i] = beneficiary;
    }

    return beneficiaries;
};