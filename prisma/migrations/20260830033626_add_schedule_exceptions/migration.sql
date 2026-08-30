-- DropForeignKey
ALTER TABLE "papers" DROP CONSTRAINT "fk_paper_schedule_lab";

-- CreateTable
CREATE TABLE "schedule_exceptions" (
    "id" BIGSERIAL NOT NULL,
    "schedule_id" BIGINT NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "occurrence_at" TIMESTAMPTZ(6) NOT NULL,
    "cancelled_by" BIGINT NOT NULL,
    "cancelled_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_schedule_exception_lab_occurrence" ON "schedule_exceptions"("lab_id", "occurrence_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_schedule_exceptions_schedule_occurrence" ON "schedule_exceptions"("schedule_id", "occurrence_at");

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "fk_paper_schedule_lab" FOREIGN KEY ("schedule_id", "lab_id") REFERENCES "schedules"("id", "lab_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_exceptions" ADD CONSTRAINT "fk_se_schedule_lab" FOREIGN KEY ("schedule_id", "lab_id") REFERENCES "schedules"("id", "lab_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_exceptions" ADD CONSTRAINT "schedule_exceptions_cancelled_by_fkey" FOREIGN KEY ("cancelled_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
