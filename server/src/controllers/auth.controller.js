import * as authService from "../services/auth.service.js";
export const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
export const me = async (req, res) => {
    try {
        const result = await authService.me(req.user);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const logout = async (req, res) => {
    try {
        await authService.logout(req.user);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



