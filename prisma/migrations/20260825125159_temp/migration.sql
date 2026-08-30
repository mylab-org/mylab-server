/*
  Warnings:

  - The `role` column on the `lab_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PROFESSOR', 'LAB_LEADER', 'SUB_LEADER', 'MEMBER');

-- AlterTable
ALTER TABLE "lab_members" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
