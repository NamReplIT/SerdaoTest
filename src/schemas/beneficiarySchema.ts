import * as yup from 'yup';

// Define a custom IBAN validation rule
const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;

const beneficiarySchema = yup.object().shape({
    id: yup.number().default(-1),
    first_name: yup.string().required('First name is required').min(2),
    last_name: yup.string().required('Last name is required').min(2),
    iban: yup.string()
        .required('IBAN is required')
        .matches(ibanRegex, 'IBAN must be a valid format'), // Validate IBAN format using regex
});

type Beneficiary = yup.InferType<typeof beneficiarySchema>;

export { beneficiarySchema };
export type { Beneficiary };