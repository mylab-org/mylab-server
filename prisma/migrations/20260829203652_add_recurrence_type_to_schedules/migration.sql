-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "recurrence_type" "RecurrenceType" NOT NULL DEFAULT 'NONE';
