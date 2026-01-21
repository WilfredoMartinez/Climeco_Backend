-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "appointment_id" UUID;

-- CreateIndex
CREATE INDEX "idx_prescriptions_appointment_id" ON "prescriptions"("appointment_id");

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
