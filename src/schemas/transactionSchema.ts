import * as yup from 'yup';

const transactionSchema = yup.object().shape({
    id: yup.number().default(-1).required(),
    amount: yup.number().default(0).min(1, 'Amount is required').required('Amount is required'),
    beneficiary_id: yup.number().required('Beneficiary is required'),
    created_at: yup.string().default(new Date().toDateString()),
    updated_at: yup.string().default(new Date().toDateString())
});

type Transaction = yup.InferType<typeof transactionSchema>;

export { transactionSchema };
export type { Transaction };
