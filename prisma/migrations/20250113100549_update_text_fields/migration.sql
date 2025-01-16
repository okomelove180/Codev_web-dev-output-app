-- AlterTable
ALTER TABLE `Output` MODIFY `originalContent` TEXT NOT NULL,
    MODIFY `correctedContent` TEXT NOT NULL,
    MODIFY `analysis` TEXT NOT NULL;
