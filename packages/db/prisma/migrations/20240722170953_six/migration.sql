/*
  Warnings:

  - Added the required column `GitHub` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TechStack` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "GitHub" TEXT NOT NULL,
ADD COLUMN     "TechStack" TEXT NOT NULL;
