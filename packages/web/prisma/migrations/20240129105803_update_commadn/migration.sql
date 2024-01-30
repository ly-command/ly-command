/*
  Warnings:

  - You are about to drop the column `code_zip` on the `command` table. All the data in the column will be lost.
  - Added the required column `version` to the `command` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_url` to the `command` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `command_command_name_key` ON `command`;

-- AlterTable
ALTER TABLE `command` DROP COLUMN `code_zip`,
    ADD COLUMN `version` VARCHAR(191) NOT NULL,
    ADD COLUMN `zip_url` VARCHAR(191) NOT NULL;
