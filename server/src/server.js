import { createServer } from "node:http";
import app from "./app.js";
import { startDeadlineJob } from "./jobs/deadline.job.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    startDeadlineJob();
});