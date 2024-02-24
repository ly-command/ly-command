/*
  Warnings:

  - You are about to drop the column `zip_url` on the `command` table. All the data in the column will be lost.
  - Added the required column `readme_content` to the `command` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `command` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `command` DROP COLUMN `zip_url`,
    ADD COLUMN `download_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `readme_content` VARCHAR(191) NOT NULL,
    ADD COLUMN `sourceId` VARCHAR(191) NOT NULL;
