/*
  Warnings:

  - You are about to drop the column `category` on the `planservice` table. All the data in the column will be lost.
  - The values [STANDARD,PREMIUM] on the enum `PlanService_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `options` on the `planservice` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - Added the required column `categoryId` to the `PlanService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `PlanService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `benefit` DROP FOREIGN KEY `Benefit_idPlan_fkey`;

-- DropForeignKey
ALTER TABLE `price` DROP FOREIGN KEY `Price_idPlan_fkey`;

-- DropIndex
DROP INDEX `Benefit_idPlan_fkey` ON `benefit`;

-- DropIndex
DROP INDEX `Price_idPlan_fkey` ON `price`;

-- AlterTable
ALTER TABLE `planservice` DROP COLUMN `category`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('Draft', 'Active', 'NonActive') NOT NULL,
    MODIFY `type` ENUM('Standard', 'Premium') NOT NULL,
    MODIFY `options` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `CategoryService` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `heading` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('Draft', 'Active', 'NonActive') NOT NULL,

    UNIQUE INDEX `CategoryService_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` ENUM('Draft', 'Active', 'NonActive') NOT NULL,
    `secretToken` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blog` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `status` ENUM('Published', 'Takedown', 'Draft') NOT NULL,
    `favorite` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BlogCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogCategoryPivot` (
    `id` VARCHAR(191) NOT NULL,
    `blogId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetaTag` (
    `id` VARCHAR(191) NOT NULL,
    `page` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanService` ADD CONSTRAINT `PlanService_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `CategoryService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `PlanService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Benefit` ADD CONSTRAINT `Benefit_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `PlanService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogCategoryPivot` ADD CONSTRAINT `BlogCategoryPivot_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogCategoryPivot` ADD CONSTRAINT `BlogCategoryPivot_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `BlogCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
