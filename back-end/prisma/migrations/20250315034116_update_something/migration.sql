-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `Pages_categoryServiceId_fkey`;

-- AddForeignKey
ALTER TABLE `Pages` ADD CONSTRAINT `Pages_categoryServiceId_fkey` FOREIGN KEY (`categoryServiceId`) REFERENCES `CategoryService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
