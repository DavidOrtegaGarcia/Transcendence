import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../components/layouts/AuthLayout";
import InputGroup from "../components/ui/InputGroup";
import AlertSuccess from "../components/ui/AlertSuccess";
import { validateEmail, validatePassword } from "../utils/validators";

const ResetPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    /* State to verify if email is on database */
    const [isEmailed, setIsEmailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    /* Inputs States */
    const [formData, setFormData] = useState({ email: "", password: "", confirm_password: "" });
    const [errors, setErrors] = useState({ email: "", password: "", confirm_password: "" });

    /* Handle Input Change */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name as keyof typeof errors]) setErrors({ ...errors, [name]: "" });
    };

    /* Validation Function by steps if mails exist the inputs to change passwords will be shown */
    const validate = (step: 'email' | 'password') => {
        /* First step: validate email */
        if (step === 'email') {
            const emailError = validateEmail(formData.email.trim(), t);
            
            /* Refresh component if email error changes */
            setErrors(prev => ({ ...prev, email: emailError }));
            
            return (!emailError);
        }

		/* Second step: validate password and confirm password */
        if (step === 'password') {
            const passwordError = validatePassword(formData.password, t);
            const confirmError = formData.password !== formData.confirm_password 
                ? t("validation.passwords_match") 
                : "";

            /* Refresh component if password errors change */
            setErrors(prev => ({ 
                ...prev, 
                password: passwordError, 
                confirm_password: confirmError 
            }));

            /* Returns true if both are clean */
            return (!passwordError && !confirmError);
        }

        return false;
    }; 
    
    /* Handle Form Submit */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEmailed) {
            if (!validate('email')) return;
            setIsLoading(true);
            setTimeout(() => {
                const emailToCheck = formData.email.trim().toLowerCase();
				/* QUITAR EMAIL CUANDO TENGA BBDD Y HACER LA LLAMADA PARA VERIFICAR QUE EL EMAIL EXISTE */ 
                if (emailToCheck === "mirindaww@hotmail.com") {
                    setIsEmailed(true);
                    setErrors(prev => ({ ...prev, email: "" }));
                } else {
                    setErrors(prev => ({ ...prev, email: t("validation.email_not_registered") }));
                }
                setIsLoading(false);
            }, 1000);
        } else {
            if (!validate('password')) return;
            setIsLoading(true);
            setIsLoading(false);
            setIsPasswordChanged(true);
            setTimeout(() => navigate("/login"), 5000);
        }
    };

    const pageTitle = isPasswordChanged ? "¡Hecho!" : t("password.title");
    const pageSubtitle = isPasswordChanged ? "Redirigiendo..." : t("password.subtitle");

    return (
        <AuthLayout title={pageTitle} subtitle={pageSubtitle}>
            {isPasswordChanged ? (
                <AlertSuccess title={`${t("password.success")} ${formData.email}`} message={t("password.back_login")} />
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    <InputGroup label={t("common.email")} type="email" name="email" placeholder="email@email.com" value={formData.email} onChange={handleChange} disabled={isEmailed || isLoading} error={errors.email} />
                    
                    {isEmailed && !errors.email && (
                        <p className="text-xs text-green-500 ml-1 -mt-2 mb-4 animate-fade-in">✓ {t("password.email_registered")}</p>
                    )}

                    {isEmailed && (
                        <div className="space-y-4 animate-fade-in-down">
                            <InputGroup label={t("common.password")} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} />
                            <InputGroup label={t("common.confirm_password")} type="password" name="confirm_password" placeholder="••••••••" value={formData.confirm_password} onChange={handleChange} error={errors.confirm_password} className="mb-8" />
                        </div>
                    )}

                    {/* Uses the class defined in CSS */}
                    <button type="submit" disabled={isLoading} 
                        className={`btn-primary-full ${isLoading ? 'bg-slate-600 cursor-wait' : ''}`}>
                        {isLoading ? t("password.processing") : isEmailed ? t("password.enter") : t("password.enter")}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;