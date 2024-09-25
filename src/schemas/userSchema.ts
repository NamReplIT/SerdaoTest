import * as yup from 'yup';
const userSchema = yup.object().shape({
    id: yup.number(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    balance: yup.number().required(),
});
type User = yup.InferType<typeof userSchema>;
export { userSchema };
export type { User }
