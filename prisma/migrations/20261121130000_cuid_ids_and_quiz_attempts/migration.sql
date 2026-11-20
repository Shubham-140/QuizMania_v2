BEGIN;

ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_userId_fkey";

ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE IF EXISTS "User_id_seq";
ALTER TABLE "QuizResult" ALTER COLUMN "userId" SET DATA TYPE TEXT;

CREATE TEMP TABLE "user_id_map" ON COMMIT DROP AS
SELECT "id" AS "old_id",
       'c' || substr(md5(random()::text || clock_timestamp()::text || "id"), 1, 24) AS "new_id"
FROM "User";

UPDATE "QuizResult" AS q SET "userId" = m."new_id"
FROM "user_id_map" AS m WHERE q."userId" = m."old_id";

UPDATE "User" AS u SET "id" = m."new_id"
FROM "user_id_map" AS m WHERE u."id" = m."old_id";

ALTER TABLE "QuizResult" RENAME TO "QuizAttempt";
ALTER TABLE "QuizAttempt" RENAME CONSTRAINT "QuizResult_pkey" TO "QuizAttempt_pkey";
DROP INDEX "QuizResult_userId_createdAt_idx";

ALTER TABLE "QuizAttempt" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "QuizAttempt" ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE IF EXISTS "QuizResult_id_seq";
UPDATE "QuizAttempt"
SET "id" = 'c' || substr(md5(random()::text || clock_timestamp()::text || "id"), 1, 24);

ALTER TABLE "QuizAttempt" ADD COLUMN "timeLimit" INTEGER;
ALTER TABLE "QuizAttempt" ADD COLUMN "completedAt" TIMESTAMP(3);
UPDATE "QuizAttempt" SET "completedAt" = "createdAt";
ALTER TABLE "QuizAttempt" ALTER COLUMN "score" SET DEFAULT 0;
ALTER TABLE "QuizAttempt" ALTER COLUMN "timeTaken" SET DEFAULT 0;

CREATE INDEX "QuizAttempt_userId_completedAt_idx" ON "QuizAttempt"("userId", "completedAt");

ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
