/*
  Warnings:

  - You are about to drop the column `paymentId` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_paymentId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentId";
