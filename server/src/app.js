import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import backlogRouter from "./routes/backlog.routes.js";
import sprintRouter from "./routes/sprint.routes.js";
import projectMemberRoutes from "./routes/projectMember.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import burndownRoutes from "./routes/burndown.routes.js";
import taskHistoryRoutes from "./routes/taskHistory.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import documentRoutes from "./routes/document.routes.js";
import documentFolderRoutes from "./routes/documentFolder.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);


app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);

app.use("/api", taskRouter);
app.use("/api", backlogRouter);
app.use("/api", sprintRouter);
app.use("/api", projectMemberRoutes);

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api", commentRoutes);
app.use("/api", burndownRoutes);
app.use("/api", taskHistoryRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api", attachmentRoutes);
app.use("/api", documentRoutes);
app.use("/api", documentFolderRoutes);

app.use("/api/settings", settingsRoutes);


const clientDistPath = path.join(
    __dirname,
    "../../client/dist"
);

app.use(
    express.static(clientDistPath)
);

app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }

    res.sendFile(
        path.join(
            clientDistPath,
            "index.html"
        )
    );
});

export default app;