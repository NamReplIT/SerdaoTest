import { ValidationError } from "yup";

export default (error: ValidationError) => {
    const { inner } = error;
    return ((inner ?? []) as ValidationError[]).reduce((acc, { path, message }) => {
        acc[path as string] = message;
        return acc;
    }, {} as { [key: string]: string });
}