-- DropForeignKey
ALTER TABLE "papers" DROP CONSTRAINT "fk_paper_schedule_lab";

-- AlterTable
ALTER TABLE "papers" ALTER COLUMN "schedule_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "fk_paper_schedule" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
