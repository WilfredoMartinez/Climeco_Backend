-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DUI', 'NIT', 'PASSPORT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "ConsentMechanism" AS ENUM ('FIRMA_FISICA', 'ACEPTACION_DIGITAL', 'APODERADO_LEGAL');

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL DEFAULT 'DUI',
    "document_number" VARCHAR(500) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "is_minor" BOOLEAN NOT NULL DEFAULT false,
    "guardian_name" VARCHAR(255),
    "gender" "Gender" NOT NULL DEFAULT 'M',
    "email" VARCHAR(150),
    "phone" VARCHAR(20),
    "address" VARCHAR(255),
    "consent_mechanism" "ConsentMechanism" NOT NULL,
    "consent_accepted_at" TIMESTAMP(3) NOT NULL,
    "medical_record_number" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_patients_first_name" ON "patients"("first_name");

-- CreateIndex
CREATE INDEX "idx_patients_last_name" ON "patients"("last_name");

-- CreateIndex
CREATE INDEX "idx_patients_document_number" ON "patients"("document_number");

-- CreateIndex
CREATE INDEX "idx_activity_logs_user_id" ON "activity_logs"("user_id");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
