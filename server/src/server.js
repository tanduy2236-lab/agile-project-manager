import app from "./app.js";
import { startDeadlineJob } from "./jobs/deadline.job.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    startDeadlineJob();
});