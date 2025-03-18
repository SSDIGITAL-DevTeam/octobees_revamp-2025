/*
  Warnings:

  - A unique constraint covering the columns `[categoryServiceId]` on the table `Pages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pages` ADD COLUMN `categoryServiceId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pages_categoryServiceId_key` ON `Pages`(`categoryServiceId`);

-- AddForeignKey
ALTER TABLE `Pages` ADD CONSTRAINT `Pages_categoryServiceId_fkey` FOREIGN KEY (`categoryServiceId`) REFERENCES `CategoryService`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
