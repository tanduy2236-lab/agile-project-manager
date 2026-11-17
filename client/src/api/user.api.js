import api from "./axios";

export const updateProfile = async (data) => {
    const response = await api.put(
        "/users/me",
        data
    );

    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.put(
        "/users/me/password",
        data
    );

    return response.data;
};

export const uploadAvatar = async (formData) => {
    const response = await api.put(
        "/users/me/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};