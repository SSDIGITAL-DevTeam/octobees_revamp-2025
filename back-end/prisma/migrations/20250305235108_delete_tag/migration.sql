/*
  Warnings:

  - You are about to drop the column `blogId` on the `blog` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blog` DROP FOREIGN KEY `Blog_blogId_fkey`;

-- DropIndex
DROP INDEX `Blog_blogId_fkey` ON `blog`;

-- AlterTable
ALTER TABLE `blog` DROP COLUMN `blogId`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `BlogCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
