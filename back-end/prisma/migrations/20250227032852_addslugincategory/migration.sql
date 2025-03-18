/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CategoryService` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `categoryservice` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CategoryService_slug_key` ON `CategoryService`(`slug`);
