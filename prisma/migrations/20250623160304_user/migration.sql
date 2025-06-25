/*
  Warnings:

  - A unique constraint covering the columns `[gitHubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gitHubUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gitHubAvatarUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gitHubAvatarUrl" TEXT,
ADD COLUMN     "gitHubId" TEXT,
ADD COLUMN     "gitHubUsername" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_gitHubId_key" ON "User"("gitHubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_gitHubUsername_key" ON "User"("gitHubUsername");

-- CreateIndex
CREATE UNIQUE INDEX "User_gitHubAvatarUrl_key" ON "User"("gitHubAvatarUrl");
