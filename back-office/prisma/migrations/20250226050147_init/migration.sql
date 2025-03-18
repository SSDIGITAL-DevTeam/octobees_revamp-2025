-- CreateTable
CREATE TABLE `PlanService` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('STANDARD', 'PREMIUM') NOT NULL,
    `showPrice` BOOLEAN NOT NULL DEFAULT true,
    `options` ENUM('MONTHLY', 'YEARLY', 'CUSTOM') NOT NULL,
    `category` ENUM('WEBSITE', 'SEO', 'ADS', 'ALL') NOT NULL,
    `descriptions` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Price` (
    `id` VARCHAR(191) NOT NULL,
    `idPlan` VARCHAR(191) NOT NULL,
    `curr` ENUM('IDR', 'SGR', 'MYR') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Benefit` (
    `id` VARCHAR(191) NOT NULL,
    `idPlan` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `PlanService`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Benefit` ADD CONSTRAINT `Benefit_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `PlanService`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
