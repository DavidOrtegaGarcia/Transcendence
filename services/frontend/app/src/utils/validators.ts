// src/utils/validators.ts

/* Regex patterns */
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const PASSWORD_NUMBER_REGEX = /\d/; 
export const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;

// Types
export interface ValidationError {
    email?: string;
    password?: string;
    username?: string;
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

/* Validate username */
export const validateUsername = (username: string, t: any): string => {
    if (!username) return t("validation.username_required");
    if (username.length < 3) return t("validation.username_short");
    if (/\s/.test(username)) return t("validation.username_spaces");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return t("validation.username_invalid");
    if (username.length > 14) return t("validation.username_long");
    if (username.toLowerCase() === "admin") return t("validation.username_reserved");
    return "";
};