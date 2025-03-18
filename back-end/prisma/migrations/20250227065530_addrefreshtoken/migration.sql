/*
  Warnings:

  - You are about to drop the column `secretToken` on the `role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `role` DROP COLUMN `secretToken`,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL;
