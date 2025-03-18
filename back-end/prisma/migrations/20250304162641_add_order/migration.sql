/*
  Warnings:

  - You are about to drop the `blogcategorypivot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `blogId` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `BlogCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blogcategorypivot` DROP FOREIGN KEY `BlogCategoryPivot_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blogcategorypivot` DROP FOREIGN KEY `BlogCategoryPivot_categoryId_fkey`;

-- AlterTable
ALTER TABLE `blog` ADD COLUMN `blogId` VARCHAR(191) NOT NULL,
    ADD COLUMN `tag` JSON NOT NULL;

-- AlterTable
ALTER TABLE `blogcategory` ADD COLUMN `status` ENUM('Draft', 'Active', 'NonActive') NOT NULL;

-- DropTable
DROP TABLE `blogcategorypivot`;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `bussiness` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `idPlan` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `BlogCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `CategoryService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `PlanService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
