-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "is_anonymous" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "is_anonymous" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "post_anonymous_numbers" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "post_anonymous_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_anonymous_numbers_user_id_idx" ON "post_anonymous_numbers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_anonymous_numbers_post_id_user_id_key" ON "post_anonymous_numbers"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_anonymous_numbers_post_id_number_key" ON "post_anonymous_numbers"("post_id", "number");

-- AddForeignKey
ALTER TABLE "post_anonymous_numbers" ADD CONSTRAINT "post_anonymous_numbers_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_anonymous_numbers" ADD CONSTRAINT "post_anonymous_numbers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
