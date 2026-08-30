/*
  Warnings:

  - You are about to drop the column `type` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `schedule_type` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('CONFERENCE', 'MEETING', 'LAB_DINNER');

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "type",
ADD COLUMN     "schedule_type" "ScheduleType" NOT NULL;
