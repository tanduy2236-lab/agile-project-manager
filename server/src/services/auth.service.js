import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as authRepository from "../repositories/auth.repository.js";
export const register = async (data) => {
    const {name, email, password} = data;

    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
    }
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
        name,
        email,
        passwordHash: hashedPassword
    });
    return {
        message: "User registered successfully",
        user: {userId: user.id, name: user.name, email: user.email}
    };
};
export const login = async (data) => {
    const {email, password} = data;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});

    return {
        accessToken: token,
        user: {userId: user.id, name: user.name, email: user.email}
    };
};
export const me = async (user) => {
    const currentUser = await authRepository.findUserById(
        user.userId
    );

    if (!currentUser) {
        throw new Error("User not found.");
    }

    return currentUser;
};
export const logout = async () => {
    return {
        message: "Logged out successfully",
    };
};