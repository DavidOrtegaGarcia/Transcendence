import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../components/layouts/AuthLayout";
import InputGroup from "../components/ui/InputGroup";
import AlertSuccess from "../components/ui/AlertSuccess";
import { validateEmail, validatePassword } from "../utils/validators";
import axios from "axios";
import api from "../services/api";

const ResetPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

	// Leemos la URL para ver si venimos desde el correo electrónico
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    
    // Si hay un token en la URL, estamos en la Fase 2 (Cambiar Contraseña)
    const isResetMode = !!token;

    /* State to verify if email is on database */
    const [isEmailed, setIsEmailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [serverError, setServerError] = useState("");

    /* Inputs States */
    // Inicializamos el email con el de la URL si existe
    const [formData, setFormData] = useState({ 
        email: emailFromUrl || "", 
        password: "", 
        confirm_password: "" 
    });
    const [errors, setErrors] = useState({ email: "", password: "", confirm_password: "" });

    /* Handle Input Change */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name as keyof typeof errors]) setErrors({ ...errors, [name]: "" });
		/* Limpiar error general del servidor al cambiar cualquier input */
		setServerError("");
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
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate('email')) return;
        
        setIsLoading(true);
        setServerError("");

        // =========================================================
        // MOCK TEMPORAL (Mientras Kevin activa en el backend /forgot-password)
        // =========================================================
        setTimeout(() => {
            const emailToCheck = formData.email.trim().toLowerCase();
            
            // Simulamos que la BBDD dice que solo existe este correo:
            if (emailToCheck === "mirindaww@gmail.com" || emailToCheck === "mail@mail.es") {
                setIsEmailed(true);
            } else {
                // Simula el error que devolverá Laravel si el email no existe
                setErrors(prev => ({ ...prev, email: t("validation.email_not_registered") }));
            }
            setIsLoading(false);
        }, 1500);

        /*
        // =========================================================
        // ✅ CÓDIGO REAL (Descomentar cuando Kevin active la ruta)
        // =========================================================
        try {
            await api.get('/sanctum/csrf-cookie');
            await api.post('/forgot-password', { 
                email: formData.email.trim().toLowerCase() 
            });
            setIsEmailed(true);
        } catch (error) {
            console.error("Error pidiendo email:", error);
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setErrors(prev => ({ ...prev, email: t("validation.email_not_registered") }));
            } else {
                setServerError(t("errors.unexpected"));
            }
        } finally {
            setIsLoading(false);
        }
        */
    };

	/* Handle Form Submit (Fase 2: Cambiar Contraseña) */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate('password')) return;
        
        setIsLoading(true);
        setServerError("");

        try {
            // Petición ESTÁNDAR de Fortify para resetear
            await api.get('/sanctum/csrf-cookie');
            await api.post('/reset-password', {
                token: token,
                email: formData.email, // Fortify necesita el email de nuevo por seguridad
                password: formData.password,
                password_confirmation: formData.confirm_password
            });
            
            // Éxito: Contraseña cambiada
            setIsPasswordChanged(true);
            setTimeout(() => navigate("/signin"), 4000);
            
        } catch (error) {
            console.error("Error reseteando password:", error);
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setServerError("El enlace ha caducado o los datos son inválidos.");
            } else {
                setServerError(t("errors.unexpected") || "Error inesperado. Inténtalo de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const pageTitle = isPasswordChanged ? "¡Hecho!" : t("password.title");
    const pageSubtitle = isPasswordChanged ? "Redirigiendo..." : t("password.subtitle");

//     

return (
        <AuthLayout title={pageTitle} subtitle={pageSubtitle}>
            
            {/* Mensaje de Error del Servidor General */}
            {serverError && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded text-sm text-center">
                    {serverError}
                </div>
            )}

            {/* CASO 3: ÉXITO TOTAL */}
            {isPasswordChanged ? (
                <AlertSuccess title={`${t("password.success")} ${formData.email}`} message={t("password.back_login")} />
            
            // CASO 2: MODO RESET (Viene del enlace del correo)
            ) : isResetMode ? (
                <form className="space-y-4 animate-fade-in" onSubmit={handleResetPassword} noValidate>
                    {/* Input email oculto pero útil para el usuario saber qué cuenta recupera */}
                    <InputGroup label={t("common.email")} type="email" name="email" value={formData.email} disabled={true} onChange={() => {}} />
                    <InputGroup label={t("common.password")} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} />
                    <InputGroup label={t("common.confirm_password")} type="password" name="confirm_password" placeholder="••••••••" value={formData.confirm_password} onChange={handleChange} error={errors.confirm_password} className="mb-8" />
                    
                    <button type="submit" disabled={isLoading} className={`btn-primary-full ${isLoading ? 'bg-slate-600 cursor-wait' : ''}`}>
                        {isLoading ? t("password.processing") : t("password.enter")}
                    </button>
                </form>

            // CASO 1: MODO PEDIR EMAIL (Aún no se ha enviado)
            ) : !isEmailed ? (
                <form className="space-y-4 animate-fade-in" onSubmit={handleForgotPassword} noValidate>
                    <InputGroup label={t("common.email")} type="email" name="email" placeholder="email@email.com" value={formData.email} onChange={handleChange} disabled={isLoading} error={errors.email} className="mb-8" />
                    
                    <button type="submit" disabled={isLoading} className={`btn-primary-full ${isLoading ? 'bg-slate-600 cursor-wait' : ''}`}>
                        {isLoading ? t("password.processing") : t("password.enter")}
                    </button>
                </form>
            
            // CASO 1.5: EMAIL ENVIADO CON ÉXITO
            ) : (
                <div className="text-center animate-fade-in-down">
					<AlertSuccess title= "¡Enlace enviado!" message={`Hemos enviado instrucciones a ${formData.email}. Revisa tu bandeja de entrada o spam.`} />
                    <AlertSuccess title= {t("password.link_sent")} message={` ${t("password.instructions_sent")} ${formData.email}. ${t("password.check_inbox")}`} />
                    <button onClick={() => navigate("/signin")} className="mt-6 text-slate-400 hover:text-brand-500 transition-colors underline text-sm">
                        {t("password.back_login")}
                    </button>
                </div>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;