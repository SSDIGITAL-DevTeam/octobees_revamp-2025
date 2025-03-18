/*
  Warnings:

  - You are about to drop the column `page` on the `metatag` table. All the data in the column will be lost.
  - Added the required column `slug` to the `MetaTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `metatag` DROP COLUMN `page`,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Pages` (
    `id` VARCHAR(191) NOT NULL,
    `page` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pages_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetaTag` ADD CONSTRAINT `MetaTag_slug_fkey` FOREIGN KEY (`slug`) REFERENCES `Pages`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;
