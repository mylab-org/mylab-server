-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR');

-- CreateTable
CREATE TABLE "conferences" (
    "id" BIGSERIAL NOT NULL,
    "name_ko" TEXT NOT NULL,
    "name_en" TEXT,
    "category" TEXT,
    "location" TEXT,
    "address" TEXT,
    "link" TEXT,
    "submission_deadline" TIMESTAMPTZ(6),
    "start_at" TIMESTAMPTZ(6),
    "end_at" TIMESTAMPTZ(6),

    CONSTRAINT "conferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_codes" (
    "id" BIGSERIAL NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_members" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ(6),

    CONSTRAINT "lab_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labs" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "university_name" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "professor_id" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_routines" (
    "id" BIGSERIAL NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6),
    "location" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "meeting_routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_skips" (
    "id" BIGSERIAL NOT NULL,
    "routine_id" BIGINT NOT NULL,
    "skip_date" DATE NOT NULL,
    "reason" TEXT,
    "notified_at" TIMESTAMPTZ(6),
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_skips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "reference_id" BIGINT,
    "reference_type" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_members" (
    "paper_id" BIGINT NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "lab_member_id" BIGINT NOT NULL,
    "role" TEXT,

    CONSTRAINT "paper_members_pkey" PRIMARY KEY ("paper_id","lab_member_id")
);

-- CreateTable
CREATE TABLE "papers" (
    "id" BIGSERIAL NOT NULL,
    "schedule_id" BIGINT NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "lead_author_member_id" BIGINT,
    "status" TEXT NOT NULL DEFAULT 'IDEA',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_participants" (
    "schedule_id" BIGINT NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "lab_member_id" BIGINT NOT NULL,

    CONSTRAINT "schedule_participants_pkey" PRIMARY KEY ("schedule_id","lab_member_id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" BIGSERIAL NOT NULL,
    "lab_id" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6),
    "location" TEXT,
    "memo" TEXT,
    "is_all_members" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT NOT NULL,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submission_deadline" TIMESTAMPTZ(6),
    "conference_id" BIGINT,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" "Degree" NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_user_id_token_key" ON "device_tokens"("user_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "invite_codes_code_key" ON "invite_codes"("code");

-- CreateIndex
CREATE INDEX "idx_invite_codes_lab_id" ON "invite_codes"("lab_id");

-- CreateIndex
CREATE INDEX "idx_lab_members_lab_id" ON "lab_members"("lab_id");

-- CreateIndex
CREATE INDEX "idx_lab_members_lab_id_left_at" ON "lab_members"("lab_id", "left_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_lab_members_active_user_lab" ON "lab_members"("user_id", "lab_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_lab_members_id_lab" ON "lab_members"("id", "lab_id");

-- CreateIndex
CREATE INDEX "idx_labs_professor_id" ON "labs"("professor_id");

-- CreateIndex
CREATE INDEX "idx_labs_status" ON "labs"("status");

-- CreateIndex
CREATE INDEX "idx_labs_university_department" ON "labs"("university_name", "department_name");

-- CreateIndex
CREATE INDEX "idx_meeting_routines_lab_id" ON "meeting_routines"("lab_id");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_skips_routine_id_skip_date_key" ON "meeting_skips"("routine_id", "skip_date");

-- CreateIndex
CREATE INDEX "idx_notifications_user_created_at" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_user_is_read" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "idx_papers_schedule_id" ON "papers"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_papers_id_lab" ON "papers"("id", "lab_id");

-- CreateIndex
CREATE INDEX "idx_schedules_lab_id_created_at" ON "schedules"("lab_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_schedules_lab_id_start_at" ON "schedules"("lab_id", "start_at");

-- CreateIndex
CREATE UNIQUE INDEX "uq_schedules_id_lab" ON "schedules"("id", "lab_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_token_key" ON "auth_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_auth_tokens_token" ON "auth_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_auth_tokens_user_id" ON "auth_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invite_codes" ADD CONSTRAINT "invite_codes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invite_codes" ADD CONSTRAINT "invite_codes_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_members" ADD CONSTRAINT "lab_members_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lab_members" ADD CONSTRAINT "lab_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meeting_routines" ADD CONSTRAINT "meeting_routines_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meeting_skips" ADD CONSTRAINT "meeting_skips_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meeting_skips" ADD CONSTRAINT "meeting_skips_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "meeting_routines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_members" ADD CONSTRAINT "fk_pm_member_lab" FOREIGN KEY ("lab_member_id", "lab_id") REFERENCES "lab_members"("id", "lab_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paper_members" ADD CONSTRAINT "fk_pm_paper_lab" FOREIGN KEY ("paper_id", "lab_id") REFERENCES "papers"("id", "lab_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "fk_paper_lead_author_lab" FOREIGN KEY ("lead_author_member_id", "lab_id") REFERENCES "lab_members"("id", "lab_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "fk_paper_schedule_lab" FOREIGN KEY ("schedule_id", "lab_id") REFERENCES "schedules"("id", "lab_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_participants" ADD CONSTRAINT "fk_sp_member_lab" FOREIGN KEY ("lab_member_id", "lab_id") REFERENCES "lab_members"("id", "lab_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule_participants" ADD CONSTRAINT "fk_sp_schedule_lab" FOREIGN KEY ("schedule_id", "lab_id") REFERENCES "schedules"("id", "lab_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
