/* Regex patterns */
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const PASSWORD_NUMBER_REGEX = /\d/; 
export const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;

// Types
export interface ValidationError {
    email?: string;
    password?: string;
    name?: string;
    confirm_password?: string;
}

/* Validate email */
export const validateEmail = (email: string, t: any): string => {
    if (!email) return t("validation.email_required");
    if (!EMAIL_REGEX.test(email)) return t("validation.email_invalid");
    return "";
};

/* Validate password */
export const validatePassword = (password: string, t: any): string => {
    if (!password) return t("validation.password_required");
    if (password.length < 6) return t("validation.password_short");
    if (!PASSWORD_UPPERCASE_REGEX.test(password)) return t("validation.password_capital");
    if (!PASSWORD_NUMBER_REGEX.test(password)) return t("validation.password_number");
    if (!PASSWORD_SPECIAL_REGEX.test(password)) return t("validation.password_special");
    return "";
};

/* Validate Name */
export const validateName = (name: string, t: any): string => {
    if (!name) return t("validation.name_required");
    if (name.length < 3) return t("validation.name_short");
    if (/\s/.test(name)) return t("validation.name_spaces");
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return t("validation.name_invalid");
    if (name.length > 14) return t("validation.name_long");
    if (name.toLowerCase() === "admin") return t("validation.name_reserved");
    return "";
};