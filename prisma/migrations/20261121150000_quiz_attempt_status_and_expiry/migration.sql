BEGIN;

CREATE TYPE "QuizAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED');

ALTER TABLE "QuizAttempt" ADD COLUMN "expiresAt" TIMESTAMP(3),
ADD COLUMN "status" "QuizAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS';

UPDATE "QuizAttempt" SET "status" = 'SUBMITTED' WHERE "completedAt" IS NOT NULL;

UPDATE "QuizAttempt"
SET "expiresAt" = "createdAt" + ("timeLimit" * INTERVAL '1 second')
WHERE "timeLimit" IS NOT NULL;

CREATE INDEX "QuizAttempt_status_expiresAt_idx" ON "QuizAttempt"("status", "expiresAt");

COMMIT;
