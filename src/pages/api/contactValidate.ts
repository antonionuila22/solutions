import { validateEmail } from "../../lib/validation";

export const validateContact = (email: string) => {
    return validateEmail(email);
}