-- 서비스 전체 공용 자유게시판 (lab_id = NULL)
INSERT INTO "board_categories" ("name", "description", "lab_id")
SELECT '자유게시판', '모든 연구실이 함께 사용하는 게시판', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM "board_categories" WHERE "lab_id" IS NULL AND "name" = '자유게시판'
);

-- 이미 생성된 연구실들의 전용 자유게시판
INSERT INTO "board_categories" ("name", "description", "lab_id")
SELECT '자유게시판', '연구실 구성원만 사용하는 게시판', l."id"
FROM "labs" l
WHERE NOT EXISTS (
  SELECT 1 FROM "board_categories" c WHERE c."lab_id" = l."id" AND c."name" = '자유게시판'
);
