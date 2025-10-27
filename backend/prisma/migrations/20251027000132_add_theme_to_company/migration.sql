-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "dark_mode_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "theme_color" TEXT NOT NULL DEFAULT 'purple',
ADD COLUMN     "theme_name" TEXT NOT NULL DEFAULT 'Aurora';
