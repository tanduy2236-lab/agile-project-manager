import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const uploadDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../uploads"
);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
});

export default upload;

export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                message: "File size must be 20 MB or smaller",
            });
        }

        return res.status(400).json({
            message: "Invalid file upload",
        });
    }

    next(error);
};