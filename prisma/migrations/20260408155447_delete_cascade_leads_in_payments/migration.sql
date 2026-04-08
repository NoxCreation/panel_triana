-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_leadId_fkey";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
