/*
  Warnings:

  - The `content` column on the `landing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "landing" DROP COLUMN "content",
ADD COLUMN     "content" JSON DEFAULT '{}';
