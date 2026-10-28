-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('WORK', 'MEETING');

-- CreateTable
CREATE TABLE "tasks" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" "TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'READY',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_user_id_start_at_idx" ON "tasks"("user_id", "start_at");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
