/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `categoryservice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `categoryservice` MODIFY `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_email_key` ON `Role`(`email`);
