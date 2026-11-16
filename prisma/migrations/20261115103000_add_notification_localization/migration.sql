ALTER TABLE "user_settings"
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'vi';

ALTER TABLE "notifications"
ADD COLUMN "content_vi" TEXT,
ADD COLUMN "content_en" TEXT;
