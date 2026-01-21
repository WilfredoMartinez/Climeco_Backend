-- DropForeignKey
ALTER TABLE "public"."prescriptions" DROP CONSTRAINT "prescriptions_medical_history_id_fkey";

-- AlterTable
ALTER TABLE "prescriptions" ALTER COLUMN "medical_history_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medical_history_id_fkey" FOREIGN KEY ("medical_history_id") REFERENCES "MedicalHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
