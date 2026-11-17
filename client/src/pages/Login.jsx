import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import SuccessModal from "../components/SuccessModal";
import { saveAuth } from "../utils/auth";
import { getTranslations, getSavedLanguage } from "../utils/language";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailRef = useRef(null);
    const language = getSavedLanguage();
    const t = getTranslations(language);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = t.auth.login.emailRequired;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t.auth.login.emailInvalid;
        }
        if (!formData.password) {
            newErrors.password = t.auth.login.passwordRequired;
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
            const result = await login({
                email: formData.email,
                password: formData.password,
            });
            console.log(result);
            saveAuth(result);
            setShowSuccessModal(true);
        } catch (error) {
            setServerError(error.response?.data?.error || t.auth.login.loginFailed);
        } finally {
            setLoading(false);
        }
    };

    const inputClassName =
        "w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 p-3 pr-12 text-sm shadow-sm outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-gray-100 dark:disabled:bg-slate-600 dark:text-white";

    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
    };

    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 shadow-xl shadow-blue-100/70 dark:shadow-black/30">
                <div className="mb-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6a4 4 0 100-8 4 4 0 000 8zm0 0c-4.418 0-8 2.686-8 6v1h16v-1c0-3.314-3.582-6-8-6z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{t.auth.login.title}</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.auth.login.description}</p>
                </div>

                <div className="mb-5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold">{t.auth.login.stayOrganized}</p>
                    <p className="mt-1">{t.auth.login.stayOrganizedDesc}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.login.email}</label>
                        <input
                            ref={emailRef}
                            disabled={loading}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClassName}
                            placeholder={t.auth.login.enterEmail}
                            autoComplete="email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.login.password}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                disabled={loading}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder={t.auth.login.enterPassword}
                                autoComplete="current-password"
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

                    {serverError && <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{serverError}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 dark:bg-blue-700 px-4 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 dark:hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-900"
                    >
                        {loading ? t.auth.login.signingIn : t.auth.login.signIn}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t.auth.login.noAccount} <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">{t.auth.login.register}</Link>
                </p>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                title={t.auth.login.successTitle}
                message={t.auth.login.successMessage}
                buttonLabel={t.common.next}
                onConfirm={handleSuccessConfirm}
                onClose={handleSuccessConfirm}
            />
        </div>
    );
};

export default Login;