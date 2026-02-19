import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from "../components/layouts/AuthLayout";
import InputGroup from "../components/ui/InputGroup";
import AlertSuccess from "../components/ui/AlertSuccess";
import { validateEmail, validatePassword, validateName } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);
	const { register, isAuthenticated } = useAuth();

	/* Redirect to /index if user is authenticated */
	useEffect(() => {
        if (isAuthenticated) {
            navigate('/index');
        }
    }, [isAuthenticated, navigate]);

    /* Inputs States */
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({ username: "", email: "", password: "" });

    /* Handle Input Change */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name as keyof typeof errors]) setErrors({ ...errors, [name]: "" });
    };

    /* Validation Function */
    const validate = (data: typeof formData) => {
        /* Validate each field using utility functions */
        const nameError = validateName(data.username, t);
        const emailError = validateEmail(data.email, t);
        const passwordError = validatePassword(data.password, t);

        const newErrors = {
            username: nameError,
            email: emailError,
            password: passwordError
        };

        setErrors(newErrors);
		/* Returns true if all are clean */
        return (!nameError && !emailError && !passwordError);
    };

    /* Handle Form Submit */
    const handleSubmit = async (e: React.FormEvent) => { // Hazlo ASYNC
        e.preventDefault();
        
        const cleanData = {
			username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
			password_confirmation: formData.password
        };

        if (validate(cleanData)) {
            try {
				console.log(cleanData);
                // LLAMADA REAL AL BACKEND
                await register(cleanData);
                
                setIsRegistered(true);
                // Si el backend loguea automáticamente, podrías redirigir a /index directamente
                // Pero si prefieres mostrar el mensaje de éxito y luego ir al login:
                setTimeout(() => navigate('/index'), 3000); 
                
            } catch (error: any) {
                // MANEJO DE ERRORES DEL BACKEND (Ej: Email ya existe)
                console.error("Fallo el registro", error);
                
				if (error.response?.status === 404)
				{
					console.log("Puto 404");
				}

                if (error.response?.status === 422) {
                    // Errores de validación de Laravel (ej: email duplicado)
                    const serverErrors = error.response.data.errors;
                    if (serverErrors.email) {
                        setErrors(prev => ({ ...prev, email: t("validation.email_registered") }));
                    }
                    if (serverErrors.name) {
                        setErrors(prev => ({ ...prev, name: t("validation.name_taken") }));
                    }
                } else {
                    // Error genérico
                    alert("Error en el registro. Inténtalo de nuevo.");
                }
            }
        }
    }

    return (
        <AuthLayout title={t('register.title')} subtitle={t('register.subtitle')}>
            
            {isRegistered ? (
                <AlertSuccess title={t("register.success")} message={t("register.redirecting")} />
            ) : (
                <form className="space-y-4" noValidate onSubmit={handleSubmit}>
                    <InputGroup label={t('common.name')} type="text" name="username" placeholder="player1" value={formData.username} onChange={handleChange} error={errors.username} />
                    <InputGroup label={t('common.email')} type="email" name="email" placeholder="email@email.com" value={formData.email} onChange={handleChange} error={errors.email} />
                    <InputGroup label={t('common.password')} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} className="mb-8" />

                    {/* Arreglado: Se usa la clase definida en CSS */}
                    <button type="submit" className="btn-primary-full">
                        {t('common.register')}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            {t('register.account')}{' '}
                            <Link to="/signin" className="text-brand-500 font-bold hover:underline transition-colors">
                                {t('common.login')}
                            </Link>
                        </p>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default Register;