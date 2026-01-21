/*
  Warnings:

  - A unique constraint covering the columns `[document_number_hash]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_hash]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_hash]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."idx_patients_document_number";

-- DropIndex
DROP INDEX "public"."idx_patients_first_name";

-- DropIndex
DROP INDEX "public"."idx_patients_last_name";

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "document_number_hash" VARCHAR(64),
ADD COLUMN     "email_hash" VARCHAR(64),
ADD COLUMN     "first_name_hash" VARCHAR(64),
ADD COLUMN     "last_name_hash" VARCHAR(64),
ADD COLUMN     "phone_hash" VARCHAR(64),
ALTER COLUMN "document_number" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "address" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patients_document_number_hash_key" ON "patients"("document_number_hash");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_hash_key" ON "patients"("email_hash");

-- CreateIndex
CREATE UNIQUE INDEX "patients_phone_hash_key" ON "patients"("phone_hash");

-- CreateIndex
CREATE INDEX "idx_patients_first_name_hash" ON "patients"("first_name_hash");

-- CreateIndex
CREATE INDEX "idx_patients_last_name_hash" ON "patients"("last_name_hash");

-- CreateIndex
CREATE INDEX "idx_patients_document_number_hash" ON "patients"("document_number_hash");

-- CreateIndex
CREATE INDEX "idx_patients_email_hash" ON "patients"("email_hash");
