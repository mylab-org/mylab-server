-- AlterTable
ALTER TABLE "labs" ADD COLUMN "description" TEXT,
ADD COLUMN "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[];
