/*
  Warnings:

  - Added the required column `createdAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifyToken` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifyTokenExpiry` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isverified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyToken" TEXT NOT NULL,
ADD COLUMN     "verifyTokenExpiry" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'user';
