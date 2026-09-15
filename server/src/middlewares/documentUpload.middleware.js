import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("uploads/documents");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });
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

const documentUpload = multer({
    storage,

    limits: {
        // 20 MB
        fileSize: 20 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            // Documents
            "application/pdf",

            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            // Text
            "text/plain",
            "text/csv",

            // Images
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",

            // Archives
            "application/zip",
            "application/x-rar-compressed",
            "application/x-7z-compressed",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "File type is not supported."
                ),
                false
            );
        }
    },
});
export default documentUpload;