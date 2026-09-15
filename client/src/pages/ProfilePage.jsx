import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/auth.api";

import {
    updateProfile,
    changePassword,
    uploadAvatar,
} from "../api/user.api";

import {
    getTranslations,
    getSavedLanguage,
} from "../utils/language";


const ProfilePage = () => {

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [
        passwordLoading,
        setPasswordLoading,
    ] = useState(false);

    const [
        avatarLoading,
        setAvatarLoading,
    ] = useState(false);


    const [
        profileMessage,
        setProfileMessage,
    ] = useState("");

    const [
        profileError,
        setProfileError,
    ] = useState("");


    const [
        avatarMessage,
        setAvatarMessage,
    ] = useState("");

    const [
        avatarError,
        setAvatarError,
    ] = useState("");


    const [
        passwordMessage,
        setPasswordMessage,
    ] = useState("");

    const [
        passwordError,
        setPasswordError,
    ] = useState("");


    const [
        avatarFile,
        setAvatarFile,
    ] = useState(null);

    const [
        avatarPreview,
        setAvatarPreview,
    ] = useState("");


    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);

            setProfileError("");

            const data =
                await getCurrentUser();

            setProfile({
                name: data.name || "",
                email: data.email || "",
                avatar: data.avatar || "",
            });

        } catch (error) {

            console.error(
                "Error loading profile:",
                error
            );

            setProfileError(
                error.response?.data?.error ||
                t.profile.failedToLoad
            );

        } finally {

            setLoading(false);

        }

    };


    const handleAvatarChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;


        if (
            !file.type.startsWith("image/")
        ) {

            setAvatarError(
                t.profile.selectImage
            );

            return;

        }


        if (
            file.size >
            10 * 1024 * 1024
        ) {

            setAvatarError(
                t.profile.avatarTooLarge
            );

            return;

        }


        setAvatarError("");
        setAvatarMessage("");

        setAvatarFile(file);

        setAvatarPreview(
            URL.createObjectURL(file)
        );

    };


    const handleAvatarUpload = async () => {

        if (!avatarFile) {

            setAvatarError(
                t.profile.selectImageFirst
            );

            return;

        }


        try {

            setAvatarLoading(true);

            setAvatarError("");
            setAvatarMessage("");


            const formData =
                new FormData();

            formData.append(
                "avatar",
                avatarFile
            );


            const result =
                await uploadAvatar(
                    formData
                );


            const updatedUser =
                result.user;


            setProfile((prev) => ({
                ...prev,
                avatar:
                    updatedUser.avatar,
            }));


            setAvatarPreview("");

            setAvatarFile(null);


            const savedUser =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    ) || "{}"
                );


            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...savedUser,
                    avatar:
                        updatedUser.avatar,
                })
            );


            setAvatarMessage(
                t.profile.avatarUploadedSuccess
            );

        } catch (error) {

            console.error(
                "Error uploading avatar:",
                error
            );

            setAvatarError(
                error.response?.data?.error ||
                t.profile.failedToUploadAvatar
            );

        } finally {

            setAvatarLoading(false);

        }

    };


    const handleProfileSubmit = async (e) => {

        e.preventDefault();


        setProfileError("");

        setProfileMessage("");


        try {

            setSaving(true);


            const result =
                await updateProfile({
                    name:
                        profile.name,
                    email:
                        profile.email,
                });


            const updatedUser =
                result.user;


            setProfile({
                name:
                    updatedUser.name,

                email:
                    updatedUser.email,

                avatar:
                    updatedUser.avatar || "",
            });


            const savedUser =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    ) || "{}"
                );


            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...savedUser,

                    userId:
                        updatedUser.id,

                    id:
                        updatedUser.id,

                    name:
                        updatedUser.name,

                    email:
                        updatedUser.email,

                    avatar:
                        updatedUser.avatar ||
                        "",
                })
            );


            setProfileMessage(
                t.profile.profileUpdateSuccess
            );

        } catch (error) {

            console.error(
                "Error updating profile:",
                error
            );

            setProfileError(
                error.response?.data?.error ||
                t.profile.failedToUpdate
            );

        } finally {

            setSaving(false);

        }

    };


    const handlePasswordSubmit =
        async (e) => {

            e.preventDefault();


            setPasswordError("");

            setPasswordMessage("");


            if (
                !passwordData.currentPassword
            ) {

                setPasswordError(
                    t.profile
                        .currentPasswordRequired
                );

                return;

            }


            if (
                !passwordData.newPassword
            ) {

                setPasswordError(
                    t.profile
                        .newPasswordRequired
                );

                return;

            }


            if (
                passwordData.newPassword
                    .length < 6
            ) {

                setPasswordError(
                    t.profile
                        .passwordMinLength
                );

                return;

            }


            if (
                passwordData.newPassword !==
                passwordData.confirmPassword
            ) {

                setPasswordError(
                    t.profile
                        .passwordMismatch
                );

                return;

            }


            try {

                setPasswordLoading(true);


                await changePassword({

                    currentPassword:
                        passwordData
                            .currentPassword,

                    newPassword:
                        passwordData
                            .newPassword,

                });


                setPasswordData({

                    currentPassword: "",

                    newPassword: "",

                    confirmPassword: "",

                });


                setPasswordMessage(
                    t.profile
                        .passwordChangeSuccess
                );

            } catch (error) {

                console.error(
                    "Error changing password:",
                    error
                );


                setPasswordError(
                    error.response?.data?.error ||
                    t.profile.failedToChange
                );

            } finally {

                setPasswordLoading(false);

            }

        };


    if (loading) {

        return (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">

                {t.profile.loading}

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">

            <div className="mx-auto max-w-4xl space-y-6">


                {/* HEADER */}

                <div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">

                        {t.profile.title}

                    </h1>


                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                        {t.profile.description}

                    </p>

                </div>


                {/* PROFILE */}

                <form
                    onSubmit={
                        handleProfileSubmit
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >

                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">

                        {
                            t.profile
                                .personalInfo
                        }

                    </h2>


                    <div className="mt-6 space-y-5">


                        {/* AVATAR */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">

                                {t.profile.avatar}

                            </label>


                            <div className="flex items-center gap-4">

                                {avatarPreview ||
                                profile.avatar ? (

                                    <img
                                        src={
                                            avatarPreview ||
                                            profile.avatar
                                        }
                                        alt={
                                            profile.name
                                        }
                                        className="h-16 w-16 rounded-full object-cover"
                                    />

                                ) : (

                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">

                                        {
                                            profile.name
                                                ?.charAt(0)
                                                .toUpperCase() ||
                                            "U"
                                        }

                                    </div>

                                )}


                                <div className="flex-1">

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleAvatarChange
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />


                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                                        {
                                            t.profile
                                                .selectAvatar
                                        }

                                    </p>


                                    {avatarFile && (

                                        <div className="mt-3">

                                            <button
                                                type="button"
                                                onClick={
                                                    handleAvatarUpload
                                                }
                                                disabled={
                                                    avatarLoading
                                                }
                                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {avatarLoading
                                                    ? t.profile
                                                        .uploading
                                                    : t.profile
                                                        .uploadAvatar}

                                            </button>


                                            {avatarMessage && (

                                                <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">

                                                    {
                                                        avatarMessage
                                                    }

                                                </p>

                                            )}


                                            {avatarError && (

                                                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">

                                                    {
                                                        avatarError
                                                    }

                                                </p>

                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* NAME */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                                {t.profile.name}

                            </label>


                            <input
                                type="text"
                                value={
                                    profile.name
                                }
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,

                                        name:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                                {t.profile.email}

                            </label>


                            <input
                                type="email"
                                value={
                                    profile.email
                                }
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,

                                        email:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />

                        </div>


                        {/* SAVE */}

                        <div className="flex items-center gap-3">

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {saving
                                    ? t.profile.saving
                                    : t.profile.save}

                            </button>


                            {profileMessage && (

                                <span className="text-sm font-medium text-green-600 dark:text-green-400">

                                    {
                                        profileMessage
                                    }

                                </span>

                            )}


                            {profileError && (

                                <span className="text-sm font-medium text-red-600 dark:text-red-400">

                                    {
                                        profileError
                                    }

                                </span>

                            )}

                        </div>

                    </div>

                </form>


                {/* PASSWORD */}

                <form
                    onSubmit={
                        handlePasswordSubmit
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >

                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">

                        {
                            t.profile
                                .changePassword
                        }

                    </h2>


                    <div className="mt-6 space-y-5">


                        {/* CURRENT PASSWORD */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                                {
                                    t.profile
                                        .currentPassword
                                }

                            </label>


                            <input
                                type="password"
                                value={
                                    passwordData
                                        .currentPassword
                                }
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,

                                        currentPassword:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />

                        </div>


                        {/* NEW PASSWORD */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                                {
                                    t.profile
                                        .newPassword
                                }

                            </label>


                            <input
                                type="password"
                                value={
                                    passwordData
                                        .newPassword
                                }
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,

                                        newPassword:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                                {
                                    t.profile
                                        .confirmPassword
                                }

                            </label>


                            <input
                                type="password"
                                value={
                                    passwordData
                                        .confirmPassword
                                }
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,

                                        confirmPassword:
                                            e.target
                                                .value,
                                    })
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />

                        </div>


                        {/* CHANGE PASSWORD */}

                        <div className="flex flex-wrap items-center gap-3">

                            <button
                                type="submit"
                                disabled={
                                    passwordLoading
                                }
                                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                            >

                                {passwordLoading
                                    ? t.profile.changing
                                    : t.profile
                                        .changePassword}

                            </button>


                            {passwordMessage && (

                                <span className="text-sm font-medium text-green-600 dark:text-green-400">

                                    ✓ {
                                        passwordMessage
                                    }

                                </span>

                            )}


                            {passwordError && (

                                <span className="text-sm font-medium text-red-600 dark:text-red-400">

                                    {
                                        passwordError
                                    }

                                </span>

                            )}

                        </div>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default ProfilePage;