-- AlterTable
ALTER TABLE "labs" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "idx_labs_deleted_at" ON "labs"("deleted_at");

-- CreateTable
CREATE TABLE "lab_links" (
    "id" BIGSERIAL NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_lab_links_lab_id" ON "lab_links"("lab_id");

-- AddForeignKey
ALTER TABLE "lab_links" ADD CONSTRAINT "lab_links_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
