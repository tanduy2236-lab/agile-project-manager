export const saveAuth = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
};
export const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
};
export const getToken = () => {
    return localStorage.getItem("accessToken");
};
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}
export const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
}