import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from "../components/layouts/AuthLayout";
import InputGroup from "../components/ui/InputGroup";
import AlertSuccess from "../components/ui/AlertSuccess";
import { validateEmail, validatePassword, validateUsername } from "../utils/validators";

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);

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
        const usernameError = validateUsername(data.username, t);
        const emailError = validateEmail(data.email, t);
        const passwordError = validatePassword(data.password, t);

        const newErrors = {
            username: usernameError,
            email: emailError,
            password: passwordError
        };

        setErrors(newErrors);
		/* Returns true if all are clean */
        return (!usernameError && !emailError && !passwordError);
    };

    /* Handle Form Submit */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanData = {
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password
        };

        if (validate(cleanData)) {
            setIsRegistered(true);
            console.log(t("register.success"), cleanData);
            setTimeout(() => navigate('/login'), 3000);
        }
    }

    return (
        <AuthLayout title={t('register.title')} subtitle={t('register.subtitle')}>
            
            {isRegistered ? (
                <AlertSuccess title={t("register.success")} message={t("register.back_login")} />
            ) : (
                <form className="space-y-4" noValidate onSubmit={handleSubmit}>
                    <InputGroup label={t('common.username')} type="text" name="username" placeholder="player1" value={formData.username} onChange={handleChange} error={errors.username} />
                    <InputGroup label={t('common.email')} type="email" name="email" placeholder="email@email.com" value={formData.email} onChange={handleChange} error={errors.email} />
                    <InputGroup label={t('common.password')} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} className="mb-8" />

                    {/* Arreglado: Se usa la clase definida en CSS */}
                    <button type="submit" className="btn-primary-full">
                        {t('common.register')}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            {t('register.account')}{' '}
                            <Link to="/login" className="text-brand-500 font-bold hover:underline transition-colors">
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