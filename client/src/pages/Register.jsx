import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth.api.js";
import SuccessModal from "../components/SuccessModal";
import { getTranslations, getSavedLanguage } from "../utils/language";

const Register = () => {
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const language = getSavedLanguage();
    const t = getTranslations(language);

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t.auth.register.nameRequired;
        }
        if (!formData.email.trim()) {
            newErrors.email = t.auth.register.emailRequired;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t.auth.register.emailInvalid;
        }
        if (!formData.password) {
            newErrors.password = t.auth.register.passwordRequired;
        } else if (formData.password.length < 6) {
            newErrors.password = t.auth.register.passwordMinLength;
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t.auth.register.confirmPasswordRequired;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t.auth.register.passwordMismatch;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            console.log("Đăng ký thành công:", result);
            setShowSuccessModal(true);
        } catch (error) {
            setServerError(
                error.response?.data?.error || t.auth.register.registrationFailed
            );
        } finally {
            setLoading(false);
        }
    };
    const inputClassName =
        "w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 p-3 pr-12 text-sm shadow-sm outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-gray-100 dark:disabled:bg-slate-600 dark:text-white";
    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        navigate("/login");
    };
    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 shadow-xl shadow-blue-100/70 dark:shadow-black/30">
                <div className="mb-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{t.auth.register.title}</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {t.auth.register.description}
                    </p>
                </div>
                <div className="mb-5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold">{t.auth.register.whyJoin}</p>
                    <p className="mt-1">{t.auth.register.whyJoinDesc}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.register.name}</label>
                        <input
                            ref={nameRef}
                            disabled={loading}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClassName}
                            placeholder={t.auth.register.enterName}
                            autoComplete="name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.register.email}</label>
                        <input
                            disabled={loading}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClassName}
                            placeholder={t.auth.register.enterEmail}
                            autoComplete="email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.register.password}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                disabled={loading}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder={t.auth.register.enterPassword}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                {showPassword ? t.auth.login.hide : t.auth.login.show}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.register.confirmPassword}</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                disabled={loading}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder={t.auth.register.confirmYourPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                {showConfirmPassword ? t.auth.login.hide : t.auth.login.show}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    {serverError && <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{serverError}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 dark:bg-blue-700 px-4 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 dark:hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-900"
                    >
                        {loading ? t.auth.register.registering : t.auth.register.register}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t.auth.register.haveAccount} <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">{t.auth.register.login}</Link>
                </p>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                title={t.auth.register.successTitle}
                message={t.auth.register.successMessage}
                buttonLabel={t.auth.register.login}
                onConfirm={handleSuccessConfirm}
                onClose={handleSuccessConfirm}
            />
        </div>
    );
};

export default Register;