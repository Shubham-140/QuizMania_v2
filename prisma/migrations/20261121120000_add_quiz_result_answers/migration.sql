-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "answers" JSONB NOT NULL DEFAULT '[]';
