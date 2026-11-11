-- AlterTable
ALTER TABLE "labs" ADD COLUMN     "description" TEXT,
ADD COLUMN     "research_fields" TEXT[] DEFAULT ARRAY[]::TEXT[];

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
