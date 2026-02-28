import { useState, useEffect, type ChangeEvent, type FormEvent, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaCamera, FaLock, FaKey, FaGlobe, FaExclamationCircle } from 'react-icons/fa';
import { MdEmail, MdEdit, MdDescription } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingState from '../components/ui/LoadingState';
import ConfirmModal from '../components/ConfirmModal';
import type { UserProfile } from '../models/User';
import { validatePassword } from '../utils/validators';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { langMapper } from '../utils/langMapper';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import dragonAvatar from '../../public/assets/avatars/dragon.png';
import rogueAvatar from '../../public/assets/avatars/rogue.png';
import queenAvatar from '../../public/assets/avatars/queen.png';
import sorceressAvatar from '../../public/assets/avatars/sorceress.png';
import warriorAvatar from '../../public/assets/avatars/warrior.png';
import wizardAvatar from '../../public/assets/avatars/wizard.png';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* Default avatars */
const AVATAR_PRESETS = [
    dragonAvatar,
    rogueAvatar,
    queenAvatar,
    sorceressAvatar,
    warriorAvatar,
    wizardAvatar
];

type ProfileFormState = Pick<UserProfile, 'username' | 'email' | 'bio' | 'language' | 'avatar'> & {
    avatarFile?: File;
    newPassword: string;
    confirmPassword: string;
};

// Función helper para previsualizar el avatar de BD en EditProfile
const getPreviewUrl = (avatarPath?: string) => {
	console.log("Avatar path from DB:", avatarPath);
    if (!avatarPath) return undefined;
    if (avatarPath.startsWith('http') ) {
        return avatarPath;
    }
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
	console.log("Cleaned avatar path:", cleanPath);
    return cleanPath;
};

const EditProfile = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const { name } = useParams<{ name?: string }>();
    const { user: authUser, isLoading: isAuthLoading } = useAuth();

    const isOwnProfile = !name || (authUser && name.toLowerCase() === authUser?.username?.toLowerCase());

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<ProfileFormState | null>(null);

    const [profileError, setProfileError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    /* Cropped Image States */
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropModal, setShowCropModal] = useState(false);

    const languageOptions = [
        { code: 'EN', label: t('edit_profile.english') },
        { code: 'ES', label: t('edit_profile.spanish') },
        { code: 'CAT', label: t('edit_profile.catalan') }
    ];

    const iconSize = 20;

    useEffect(() => {
        if (isAuthLoading) return;
        if (!authUser) {
            navigate('/signin');
            return;
        }
        
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const userData = await userService.getProfile(authUser.id);
                const dbToI18n: Record<string, string> = { 'EN': 'en', 'ES': 'es', 'CAT': 'ca' };
                const dbLang = userData.language as 'EN' | 'ES' | 'CAT';
                const currentLangCode = dbToI18n[dbLang] || localStorage.getItem('lang') || 'en';

                setFormData({
                    username: userData.username || "",
                    email: userData.email || "",
                    // Parseamos la URL para previsualizar lo que ya había en BD
                    avatar: getPreviewUrl(userData.avatar) || "", 
                    bio: userData.bio || "",
                    language: dbLang || 'EN',
                    newPassword: "",
                    confirmPassword: ""
                });

                if (i18n.language !== currentLangCode) {
                    i18n.changeLanguage(currentLangCode);
                    localStorage.setItem('lang', currentLangCode);
                }
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [isAuthLoading, authUser]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'language') return;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
        if (name === 'newPassword' || name === 'confirmPassword') setPasswordError(null);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        setAvatarError(null);

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                setAvatarError(t('edit_profile.avatar_error_file'));
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                setAvatarError(t('edit_profile.avatar_error_size'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageToCrop(reader.result as string);
                setShowCropModal(true);
            };
            e.target.value = '';
        }
    };

    const onCropComplete = useCallback ((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        if (!imageToCrop || !croppedAreaPixels) return;
        try {
            const croppedFile = await getCroppedImg(imageToCrop!, croppedAreaPixels);
            if (croppedFile) {
                const previewUrl = URL.createObjectURL(croppedFile);
                setFormData(prev => prev ? {
                    ...prev,
                    avatarFile: croppedFile,
                    avatar: previewUrl,
                } : null);
            }
            setShowCropModal(false);
            setImageToCrop(null);
        } catch (error) {
            console.error(t('edit_profile.avatar_error_crop'), error);
            setAvatarError(t('edit_profile.avatar_error_crop'));
        }
    };

    const handleSelectPreset = async (presetUrl: string) => {
        setAvatarError(null);
        setProfileError(null);
        
        setFormData(prev => prev ? { ...prev, avatar: presetUrl } : null);

        try {
            const response = await fetch(presetUrl);
            if (!response.ok) throw new Error("No se pudo descargar la imagen predefinida");
            const blob = await response.blob();
            const file = new File([blob], 'preset_avatar.png', { type: blob.type });

            setFormData(prev => prev ? { ...prev, avatarFile: file } : null);
        } catch (error) {
            console.error("Error al convertir el preset a archivo:", error);
            setAvatarError(t('edit_profile.avatar_error_file') || "Error al procesar la imagen predefinida");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        if (formData.newPassword) {
            const validationError = validatePassword(formData.newPassword, t);
            if (validationError) {
                setPasswordError(validationError);
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setPasswordError(t('validation.passwords_match'));
                return;
            }
        }

        setIsSaving(true);

        try {
            const profileFormData = new FormData();

            if (formData.username) profileFormData.append('username', formData.username);
            if (formData.email) profileFormData.append('email', formData.email);
            if (formData.bio) profileFormData.append('bio', formData.bio);
            if (formData.language) profileFormData.append('language', formData.language);
            
            if (formData.avatarFile) {
                profileFormData.append('avatar', formData.avatarFile, formData.avatarFile.name || 'avatar.png');
            }

            await userService.updateProfile(profileFormData);

            if (formData.newPassword) await userService.updatePassword(formData.newPassword);

            const targetLang = langMapper[formData.language || 'EN'];
            i18n.changeLanguage(targetLang);
            localStorage.setItem('lang', targetLang);

            setShowSuccessModal(true);

        } catch (error: any) {
            console.error("Error devuelto por la API:", error.response?.data);
            const errorMessage = error.response?.data?.message || "Error al actualizar";
            setProfileError(errorMessage); 
        } finally {
            setIsSaving(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigate('/profile');
    };

    const handleCancelClose = () => {
        setShowSuccessModal(false);
        window.location.href = '/profile';
        navigate('/edit_profile');
    };

    const handleLanguageSelect = (langCode: string) => {
        setFormData(prev => prev ? { ...prev, language: langCode as 'EN' | 'ES' | 'CAT' } : null);
        setIsLanguageOpen(false);

        const targetLang = langMapper[langCode];
        i18n.changeLanguage(targetLang);
        localStorage.setItem('lang', targetLang);
    };

    if (isLoading) return <DashboardLayout isCentered={true}><LoadingState message={t('common.loading')} /></DashboardLayout>;
    if (!formData) return null;

    return (
        <DashboardLayout isCentered={false}>
            <div className="max-w-2xl mx-auto w-full animate-fade-in-up pb-20">

                <div className="mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FaUser className="text-brand-500" /> {t('profile.edit_profile')}
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        {t('edit_profile.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {profileError && (
                        <div className="mb-6 bg-danger/10 border border-danger/20 text-danger text-sm p-4 rounded-xl animate-fade-in-down border-l-4 border-l-danger">
                            {profileError}
                        </div>
                    )}

                    <div className="glass-panel p-6 md:p-8 space-y-8 relative z-10">

                        <div className="flex flex-col items-center gap-6">

                            <div className="relative group cursor-pointer">
                                <div className={`w-32 h-32 rounded-full border-4 ${avatarError ? 'border-danger' : 'border-dark-800'} shadow-2xl overflow-hidden bg-dark-900`}>
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><FaUser size={48} /></div>
                                    )}
                                </div>
                                <input type="file" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={handleImageUpload} />

                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none rounded-full">
                                    <FaCamera className="text-white text-2xl" />
                                </div>
                            </div>

                            {avatarError && (
                                <p className="text-danger text-xs flex items-center gap-1 animate-pulse">
                                    <FaExclamationCircle /> {avatarError}
                                </p>
                            )}

                            <div className="w-full flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span>{t('edit_profile.choose_avatar')}</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3">
                                {AVATAR_PRESETS.map((preset, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSelectPreset(preset)}
                                        className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${formData.avatar === preset ? 'border-brand-500 shadow-[0_0_10px_rgba(var(--color-brand-500),0.5)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={preset} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-6 pt-4 border-t border-white/5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2"><MdEdit className="text-brand-500" size={iconSize} /> {t('common.name')}</label>
                                <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="input-nexus w-full" placeholder={t('common.name')} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2"><MdEmail className="text-slate-500" size={iconSize} /> {t('common.email')}</label>
                                <input type="email" name="email" value={formData.email} readOnly className="input-nexus w-full bg-black/20 text-slate-500 border-white/5 cursor-not-allowed" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2"><MdDescription className="text-brand-500" size={iconSize} /> {t('edit_profile.bio') || "Biografía"}</label>
                                <textarea name="bio" value={formData.bio || ""} onChange={handleInputChange} className="input-nexus w-full h-24 resize-none py-2" maxLength={150} />
                                <div className="text-right text-xs text-slate-500">{(formData.bio || "").length}/150</div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2">
                                    <FaGlobe className="text-brand-500" size={iconSize} /> {t('edit_profile.language') || "Idioma"}
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                    className="input-nexus w-full flex justify-between items-center text-left cursor-pointer focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                                >
                                    <span className="flex items-center gap-2">
                                        {languageOptions.find(opt => opt.code === formData.language)?.label || formData.language}
                                    </span>
                                    <TiArrowSortedDown
                                        size={iconSize}
                                        className={`text-slate-400 transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isLanguageOpen && (
                                    <div className="absolute z-999 top-full left-0 right-0 mt-2 bg-dark-800 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fade-in-down backdrop-blur-xl">
                                        <ul className="py-1">
                                            {languageOptions.map((option) => (
                                                <li
                                                    key={option.code}
                                                    onClick={() => handleLanguageSelect(option.code)}
                                                    className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between
                                                        ${formData.language === option.code
                                                            ? 'bg-brand-500/20 text-white font-bold border-l-4 border-brand-500'
                                                            : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent'}
                                                    `}
                                                >
                                                    {option.label}
                                                    {formData.language === option.code}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {isLanguageOpen && (
                                    <div
                                        className="fixed inset-0 z-40 bg-transparent cursor-default"
                                        onClick={() => setIsLanguageOpen(false)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 md:p-8 space-y-6 relative z-0">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                            <FaLock className="text-brand-500" size={iconSize} /> {t('edit_profile.security') || "Seguridad"}
                        </h3>
                        {passwordError && (
                            <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-lg animate-pulse border-l-4 border-l-danger">
                                {passwordError}
                            </div>
                        )}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2"><FaKey className="text-slate-500" /> {t('edit_profile.new_password') || "Nueva Contraseña"}</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className={`input-nexus w-full ${passwordError ? 'border-danger/50 focus:border-danger' : ''}`} autoComplete="new-password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2"><FaKey className="text-slate-500" /> {t('edit_profile.confirm_new_password') || "Confirmar Contraseña"}</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`input-nexus w-full ${passwordError ? 'border-danger/50 focus:border-danger' : ''}`} autoComplete="new-password" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="btn-secondary px-6 py-3 rounded-xl font-bold">Cancelar</button>
                        <button type="submit" disabled={isSaving} className={`btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {isSaving ? <>{t('edit_profile.saving')}</> : <> {t('edit_profile.save')}</>}
                        </button>
                    </div>
                </form>

                <ConfirmModal
                    isOpen={showSuccessModal}
                    title={t('edit_profile.save')}
                    message={t('edit_profile.sure')}
                    confirmText={t('common.accept')}
                    cancelText={t('common.decline')}
                    onConfirm={handleSuccessClose}
                    onCancel={handleCancelClose}
                />

                {showCropModal && imageToCrop && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="glass-panel w-full max-w-lg overflow-hidden flex flex-col h-125">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-800">
                                <h3 className="text-lg font-bold text-white">Ajustar Imagen</h3>
                                <button onClick={() => setShowCropModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                    ✕
                                </button>
                            </div>
                            
                            <div className="relative flex-1 w-full bg-black">
                                {/* @ts-ignore: to avoid error in Cropper component */}
                                <Cropper 
                                    image={imageToCrop}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <div className="p-4 bg-dark-800 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-sm">Zoom</span>
                                    <input 
                                        type="range" 
                                        value={zoom} 
                                        min={1} 
                                        max={3} 
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))} 
                                        className="w-full accent-brand-500"
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCropModal(false)} 
                                        className="btn-secondary px-6 py-2 rounded-xl text-sm font-bold"
                                    >
                                        {t('common.decline')}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleCropSave} 
                                        className="btn-primary px-6 py-2 rounded-xl text-sm font-bold"
                                    >
                                        {t('common.accept')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default EditProfile;