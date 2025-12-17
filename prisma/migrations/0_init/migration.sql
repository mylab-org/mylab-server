-- ---------- common: updated_at trigger ----------
CREATE
    OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at
        = now();
    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

-- =====================================================
-- USER DOMAIN
-- =====================================================

CREATE TABLE users
(
    id               BIGSERIAL PRIMARY KEY,
    username         TEXT UNIQUE NOT NULL,
    phone            TEXT UNIQUE NOT NULL,
    password         TEXT        NOT NULL,
    name             TEXT        NOT NULL,
    degree           TEXT                 DEFAULT 'BACHELOR',
    professor_email  TEXT UNIQUE,
    professor_status TEXT        NOT NULL DEFAULT 'NONE',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    refresh_token    TEXT,

    CONSTRAINT chk_professor_email_status CHECK (
        (professor_status = 'NONE' AND professor_email IS NULL)
            OR
        (professor_status IN ('PENDING', 'VERIFIED') AND professor_email IS NOT NULL)
        ),
    CONSTRAINT chk_degree CHECK (
        (degree IN ('BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'))
        )
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Test User (password: password123)
INSERT INTO public.users (username, phone, password, name, degree, professor_email, professor_status, created_at,
                          updated_at)
VALUES ('test1234', '01012341234', '$2b$10$sdeAwH8kIrgcD78xN3vwle484hsUFPv10U4LFpSYBRLYtCZIMtvBK', '김교수', 'PROFESSOR',
        'prof@univ.ac.kr', 'VERIFIED', default, default);

CREATE TABLE labs
(
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT        NOT NULL,
    school_name     TEXT        NOT NULL,
    department_name TEXT        NOT NULL,
    professor_id    BIGINT      NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_labs_professor_id ON labs (professor_id);
CREATE INDEX idx_labs_school_department ON labs (school_name, department_name);

-- VERIFIED professor only can create labs
CREATE
    OR REPLACE FUNCTION check_professor_verified()
    RETURNS TRIGGER AS
$$
DECLARE
    prof_status TEXT;
BEGIN
    SELECT professor_status
    INTO prof_status
    FROM users
    WHERE id = NEW.professor_id;

    IF
        prof_status IS NULL THEN
        RAISE EXCEPTION '교수(professor_id=%)가 존재하지 않습니다', NEW.professor_id;
    END IF;

    IF
        prof_status != 'VERIFIED' THEN
        RAISE EXCEPTION
            '인증된 교수만 연구실을 생성할 수 있습니다 (현재 상태: %)',
            prof_status;
    END IF;

    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER trg_check_professor_verified
    BEFORE INSERT
    ON labs
    FOR EACH ROW
EXECUTE FUNCTION check_professor_verified();


CREATE TABLE lab_members
(
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT      NOT NULL REFERENCES users (id),
    lab_id    BIGINT      NOT NULL REFERENCES labs (id),
    role      TEXT        NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    left_at   TIMESTAMPTZ,

    CONSTRAINT chk_lab_member_role CHECK (role IN ('PROFESSOR', 'LAB_LEADER', 'MEMBER')),

    -- 같은 연구실 중복 "활성" 가입 방지
    CONSTRAINT uq_lab_members_active_user_lab UNIQUE (user_id, lab_id) DEFERRABLE INITIALLY IMMEDIATE
);

-- 활성 멤버는 "딱 1개 연구실"만 허용 (요구사항: 1인 1연구실)
CREATE UNIQUE INDEX uq_lab_members_active_user
    ON lab_members (user_id) WHERE left_at IS NULL;

-- composite FK를 위해 필요: (id, lab_id)로 FK 걸 수 있게 유니크 보장
CREATE UNIQUE INDEX uq_lab_members_id_lab
    ON lab_members (id, lab_id);

CREATE INDEX idx_lab_members_lab_id ON lab_members (lab_id);
CREATE INDEX idx_lab_members_lab_id_left_at ON lab_members (lab_id, left_at);

-- 랩장 최대 2명 제한
CREATE
    OR REPLACE FUNCTION check_lab_leader_limit()
    RETURNS TRIGGER AS
$$
DECLARE
    leader_count INTEGER;
BEGIN
    IF
        NEW.role = 'LAB_LEADER' AND NEW.left_at IS NULL
            AND (
            TG_OP = 'INSERT'
                OR
            (TG_OP = 'UPDATE' AND (OLD.role IS DISTINCT FROM NEW.role OR OLD.left_at IS DISTINCT FROM NEW.left_at))
            )
    THEN
        SELECT COUNT(*)
        INTO leader_count
        FROM lab_members
        WHERE lab_id = NEW.lab_id
          AND role = 'LAB_LEADER'
          AND left_at IS NULL
          AND id <> COALESCE(NEW.id, 0);

        IF
            leader_count >= 2 THEN
            RAISE EXCEPTION '연구실당 최대 2명의 랩장만 지정할 수 있습니다 (현재: %명)', leader_count;
        END IF;
    END IF;

    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER trg_lab_leader_limit
    BEFORE INSERT OR
        UPDATE
    ON lab_members
    FOR EACH ROW
EXECUTE FUNCTION check_lab_leader_limit();


CREATE TABLE invite_codes
(
    id           BIGSERIAL PRIMARY KEY,
    lab_id       BIGINT             NOT NULL REFERENCES labs (id),
    code         VARCHAR(20) UNIQUE NOT NULL,
    max_uses     INTEGER,
    current_uses INTEGER            NOT NULL DEFAULT 0,
    expires_at   TIMESTAMPTZ,
    is_active    BOOLEAN            NOT NULL DEFAULT true,
    created_by   BIGINT             NOT NULL REFERENCES users (id),
    created_at   TIMESTAMPTZ        NOT NULL DEFAULT now(),

    CONSTRAINT chk_invite_uses CHECK (
        current_uses >= 0
            AND (max_uses IS NULL OR max_uses > 0)
            AND (max_uses IS NULL OR current_uses <= max_uses)
        )
);

CREATE INDEX idx_invite_codes_lab_id ON invite_codes (lab_id);

-- =====================================================
-- REFERENCE DATA
-- =====================================================

CREATE TABLE conferences
(
    id                  BIGSERIAL PRIMARY KEY,
    name_ko             TEXT NOT NULL,
    name_en             TEXT,
    category            TEXT,
    location            TEXT,
    address             TEXT,
    link                TEXT,
    submission_deadline TIMESTAMPTZ,
    start_at            TIMESTAMPTZ,
    end_at              TIMESTAMPTZ
);

-- =====================================================
-- SCHEDULE DOMAIN
-- =====================================================

CREATE TABLE schedules
(
    id                  BIGSERIAL PRIMARY KEY,
    lab_id              BIGINT      NOT NULL REFERENCES labs (id),

    type                TEXT        NOT NULL,
    title               TEXT        NOT NULL,
    start_at            TIMESTAMPTZ NOT NULL,
    end_at              TIMESTAMPTZ,
    location            TEXT,
    memo                TEXT,

    is_all_members      BOOLEAN     NOT NULL DEFAULT true,

    created_by          BIGINT      NOT NULL REFERENCES users (id),
    updated_by          BIGINT REFERENCES users (id),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    submission_deadline TIMESTAMPTZ,
    conference_id       BIGINT REFERENCES conferences (id),

    CONSTRAINT chk_schedule_type CHECK (type IN ('CONFERENCE', 'MEETING', 'DINNER')),
    CONSTRAINT chk_conference_fields CHECK (
        type = 'CONFERENCE'
            OR (submission_deadline IS NULL AND conference_id IS NULL)
        )
);

-- composite FK 위해 필요
CREATE UNIQUE INDEX uq_schedules_id_lab
    ON schedules (id, lab_id);

CREATE INDEX idx_schedules_lab_id_start_at ON schedules (lab_id, start_at);
CREATE INDEX idx_schedules_lab_id_created_at ON schedules (lab_id, created_at);

CREATE TRIGGER trg_schedules_updated_at
    BEFORE UPDATE
    ON schedules
    FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- Cross-lab participant insertion blocked:
-- enforce schedule.lab_id == lab_member.lab_id using composite FKs
CREATE TABLE schedule_participants
(
    schedule_id   BIGINT NOT NULL,
    lab_id        BIGINT NOT NULL,
    lab_member_id BIGINT NOT NULL,

    PRIMARY KEY (schedule_id, lab_member_id),

    CONSTRAINT fk_sp_schedule_lab
        FOREIGN KEY (schedule_id, lab_id)
            REFERENCES schedules (id, lab_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_sp_member_lab
        FOREIGN KEY (lab_member_id, lab_id)
            REFERENCES lab_members (id, lab_id)
);

-- Papers: same-lab enforced + only CONFERENCE schedules allowed
CREATE TABLE papers
(
    id                    BIGSERIAL PRIMARY KEY,

    schedule_id           BIGINT      NOT NULL,
    lab_id                BIGINT      NOT NULL,

    title                 TEXT        NOT NULL,
    lead_author_member_id BIGINT,
    status                TEXT        NOT NULL DEFAULT 'IDEA',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_paper_schedule_lab
        FOREIGN KEY (schedule_id, lab_id)
            REFERENCES schedules (id, lab_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_paper_lead_author_lab
        FOREIGN KEY (lead_author_member_id, lab_id)
            REFERENCES lab_members (id, lab_id),

    CONSTRAINT chk_paper_status CHECK (status IN ('IDEA', 'IN_PROGRESS', 'SUBMITTED'))
);

CREATE UNIQUE INDEX uq_papers_id_lab
    ON papers (id, lab_id);

CREATE INDEX idx_papers_schedule_id ON papers (schedule_id);

-- 논문은 CONFERENCE 일정에만 추가 가능
CREATE
    OR REPLACE FUNCTION check_paper_schedule_type()
    RETURNS TRIGGER AS
$$
DECLARE
    schedule_type TEXT;
BEGIN
    SELECT type
    INTO schedule_type
    FROM schedules
    WHERE id = NEW.schedule_id;

    IF
        schedule_type IS NULL THEN
        RAISE EXCEPTION 'schedule_id % not found', NEW.schedule_id;
    END IF;

    IF
        schedule_type != 'CONFERENCE' THEN
        RAISE EXCEPTION '논문은 학회(CONFERENCE) 타입 일정에만 추가할 수 있습니다 (현재: %)', schedule_type;
    END IF;

    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER trg_paper_schedule_type
    BEFORE INSERT OR
        UPDATE
    ON papers
    FOR EACH ROW
EXECUTE FUNCTION check_paper_schedule_type();


CREATE TABLE paper_members
(
    paper_id      BIGINT NOT NULL,
    lab_id        BIGINT NOT NULL,
    lab_member_id BIGINT NOT NULL,
    role          TEXT,

    PRIMARY KEY (paper_id, lab_member_id),

    CONSTRAINT fk_pm_paper_lab
        FOREIGN KEY (paper_id, lab_id)
            REFERENCES papers (id, lab_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_pm_member_lab
        FOREIGN KEY (lab_member_id, lab_id)
            REFERENCES lab_members (id, lab_id)
);

-- =====================================================
-- MEETING ROUTINE
-- =====================================================

CREATE TABLE meeting_routines
(
    id          BIGSERIAL PRIMARY KEY,
    lab_id      BIGINT  NOT NULL REFERENCES labs (id),
    day_of_week INTEGER NOT NULL,
    start_time  TIME    NOT NULL,
    end_time    TIME,
    location    TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT chk_day_of_week CHECK (day_of_week BETWEEN 0 AND 6)
);

CREATE INDEX idx_meeting_routines_lab_id ON meeting_routines (lab_id);


CREATE TABLE meeting_skips
(
    id          BIGSERIAL PRIMARY KEY,
    routine_id  BIGINT      NOT NULL REFERENCES meeting_routines (id) ON DELETE CASCADE,
    skip_date   DATE        NOT NULL,
    reason      TEXT,
    notified_at TIMESTAMPTZ,
    created_by  BIGINT      NOT NULL REFERENCES users (id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (routine_id, skip_date)
);

-- =====================================================
-- NOTIFICATION
-- =====================================================

CREATE TABLE device_tokens
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users (id),
    token      TEXT        NOT NULL,
    platform   TEXT        NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_platform CHECK (platform IN ('IOS', 'ANDROID')),
    UNIQUE (user_id, token)
);

CREATE TRIGGER trg_device_tokens_updated_at
    BEFORE UPDATE
    ON device_tokens
    FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


CREATE TABLE notifications
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT      NOT NULL REFERENCES users (id),
    type           TEXT        NOT NULL,
    title          TEXT        NOT NULL,
    body           TEXT,
    reference_id   BIGINT,
    reference_type TEXT,
    is_read        BOOLEAN     NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_notification_type CHECK (
        type IN (
                 'SCHEDULE_CREATED', 'SCHEDULE_UPDATED', 'SCHEDULE_DELETED', 'MEETING_SKIPPED', 'LAB_JOINED'
            )
        )
);

CREATE INDEX idx_notifications_user_created_at ON notifications (user_id, created_at);
CREATE INDEX idx_notifications_user_is_read ON notifications (user_id, is_read);