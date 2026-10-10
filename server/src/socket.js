
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import * as projectMemberService from "./services/projectMember.service.js";

let io;
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication required."));
        }

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            socket.data.userId = user.userId;
            return next();
        } catch {
            return next(new Error("Invalid or expired token."));
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("project:join", async (projectId) => {
            const parsedProjectId = Number(projectId);

            if (!Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
                return;
            }

            try {
                await projectMemberService.getMemberRole(
                    parsedProjectId,
                    socket.data.userId
                );
                socket.join(`project:${parsedProjectId}`);
            } catch {
                socket.emit("project:access-denied", parsedProjectId);
            }
        });

        socket.on("project:leave", (projectId) => {
            const parsedProjectId = Number(projectId);

            if (Number.isInteger(parsedProjectId) && parsedProjectId > 0) {
                socket.leave(`project:${parsedProjectId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
};
