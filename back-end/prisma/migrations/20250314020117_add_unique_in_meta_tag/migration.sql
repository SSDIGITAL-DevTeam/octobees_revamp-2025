/*
  Warnings:

  - A unique constraint covering the columns `[slug,value]` on the table `MetaTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `MetaTag_slug_value_key` ON `MetaTag`(`slug`, `value`);
