-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DORMANT', 'SUSPENDED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
