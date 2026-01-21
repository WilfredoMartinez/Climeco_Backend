/*
  Warnings:

  - The primary key for the `account_payable_payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `account_receivables` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `accounts_payable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `allergies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `answers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exam_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exam_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `medication_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `medications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patient_allergies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patient_surveys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `surveys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `account_payable_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `accounts_payable_id` on the `account_payable_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `account_receivables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patient_id` on the `account_receivables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `accounts_payable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patient_id` on the `accounts_payable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `allergies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `answers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patient_survey_id` on the `answers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `question_id` on the `answers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `exam_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `exam_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exam_category_id` on the `exam_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `medication_categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `medications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category_id` on the `medications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `patient_allergies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patient_id` on the `patient_allergies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `allergy_type_id` on the `patient_allergies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `patient_surveys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `patient_id` on the `patient_surveys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `survey_id` on the `patient_surveys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `patients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `account_receivable_id` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `survey_id` on the `questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `surveys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('PENDING', 'COMPLETED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AppointmentStatusName" AS ENUM ('SCHEDULED', 'IN_VITALS', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('FIRST_TIME', 'FOLLOW_UP', 'EMERGENCY', 'ROUTINE');

-- CreateEnum
CREATE TYPE "OralHygieneLevel" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "GumCondition" AS ENUM ('HEALTHY', 'GINGIVITIS', 'PERIODONTITIS', 'BLEEDING', 'INFLAMMATION');

-- CreateEnum
CREATE TYPE "ToothCondition" AS ENUM ('HEALTHY', 'CARIES', 'FILLED', 'FRACTURED', 'MISSING', 'CROWN', 'BRIDGE', 'IMPLANT', 'ROOT_CANAL', 'EXTRACTION_NEEDED', 'WISDOM_TOOTH');

-- DropForeignKey
ALTER TABLE "public"."account_payable_payments" DROP CONSTRAINT "account_payable_payments_accounts_payable_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."account_receivables" DROP CONSTRAINT "account_receivables_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."accounts_payable" DROP CONSTRAINT "accounts_payable_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."answers" DROP CONSTRAINT "answers_patient_survey_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."answers" DROP CONSTRAINT "answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."exam_types" DROP CONSTRAINT "exam_types_exam_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."medications" DROP CONSTRAINT "medications_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_allergies" DROP CONSTRAINT "patient_allergies_allergy_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_allergies" DROP CONSTRAINT "patient_allergies_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_surveys" DROP CONSTRAINT "patient_surveys_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_surveys" DROP CONSTRAINT "patient_surveys_survey_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_account_receivable_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_survey_id_fkey";

-- AlterTable
ALTER TABLE "account_payable_payments" DROP CONSTRAINT "account_payable_payments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "accounts_payable_id",
ADD COLUMN     "accounts_payable_id" UUID NOT NULL,
ADD CONSTRAINT "account_payable_payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "account_receivables" DROP CONSTRAINT "account_receivables_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "patient_id",
ADD COLUMN     "patient_id" UUID NOT NULL,
ADD CONSTRAINT "account_receivables_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "accounts_payable" DROP CONSTRAINT "accounts_payable_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "patient_id",
ADD COLUMN     "patient_id" UUID NOT NULL,
ADD CONSTRAINT "accounts_payable_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "allergies" DROP CONSTRAINT "allergies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "allergies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "answers" DROP CONSTRAINT "answers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "patient_survey_id",
ADD COLUMN     "patient_survey_id" UUID NOT NULL,
DROP COLUMN "question_id",
ADD COLUMN     "question_id" UUID NOT NULL,
ADD CONSTRAINT "answers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_categories" DROP CONSTRAINT "exam_categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "exam_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_types" DROP CONSTRAINT "exam_types_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "exam_category_id",
ADD COLUMN     "exam_category_id" UUID NOT NULL,
ADD CONSTRAINT "exam_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medication_categories" DROP CONSTRAINT "medication_categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "medication_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medications" DROP CONSTRAINT "medications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" UUID NOT NULL,
ADD CONSTRAINT "medications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "patient_allergies" DROP CONSTRAINT "patient_allergies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "patient_id",
ADD COLUMN     "patient_id" UUID NOT NULL,
DROP COLUMN "allergy_type_id",
ADD COLUMN     "allergy_type_id" UUID NOT NULL,
ADD CONSTRAINT "patient_allergies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "patient_surveys" DROP CONSTRAINT "patient_surveys_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "patient_id",
ADD COLUMN     "patient_id" UUID NOT NULL,
DROP COLUMN "survey_id",
ADD COLUMN     "survey_id" UUID NOT NULL,
ADD CONSTRAINT "patient_surveys_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "patients" DROP CONSTRAINT "patients_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "account_receivable_id",
ADD COLUMN     "account_receivable_id" UUID NOT NULL,
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "questions" DROP CONSTRAINT "questions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "survey_id",
ADD COLUMN     "survey_id" UUID NOT NULL,
ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "surveys" DROP CONSTRAINT "surveys_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "surveys_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "exam_type_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" "AppointmentType" NOT NULL DEFAULT 'ROUTINE',
    "status" "AppointmentStatusName" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "vitals_taken_at" TIMESTAMP(3),
    "consultation_started_at" TIMESTAMP(3),
    "consultation_ended_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vital_signs" (
    "id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "recorded_by_id" UUID NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "systolic_pressure" INTEGER,
    "diastolic_pressure" INTEGER,
    "heart_rate" INTEGER,
    "respiratory_rate" INTEGER,
    "oxygen_saturation" DOUBLE PRECISION,
    "notes" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "chief_complaint" TEXT,
    "present_illness" TEXT,
    "physical_exam" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "lab_orders" TEXT,
    "follow_up_notes" TEXT,
    "next_visit_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "visit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dental_histories" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "chief_complaint" TEXT,
    "diagnosis" TEXT,
    "oral_hygiene_level" "OralHygieneLevel" NOT NULL DEFAULT 'FAIR',
    "gum_condition" "GumCondition" NOT NULL DEFAULT 'HEALTHY',
    "has_calculus" BOOLEAN NOT NULL DEFAULT false,
    "has_plaque" BOOLEAN NOT NULL DEFAULT false,
    "has_halitosis" BOOLEAN NOT NULL DEFAULT false,
    "treatment_plan" TEXT,
    "next_visit_date" TIMESTAMP(3),
    "recommendations" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dental_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "odontograms" (
    "id" UUID NOT NULL,
    "dental_history_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "odontograms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teeth" (
    "id" UUID NOT NULL,
    "odontogramId" UUID NOT NULL,
    "tooth_number" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "quadrant" INTEGER,
    "affected_surfaces" TEXT,
    "condition" "ToothCondition" NOT NULL DEFAULT 'HEALTHY',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teeth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" UUID NOT NULL,
    "medical_history_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "prescription_number" TEXT NOT NULL,
    "general_instructions" TEXT,
    "diet_recommendations" TEXT,
    "restrictions" TEXT,
    "valid_until" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_items" (
    "id" UUID NOT NULL,
    "prescription_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "administration" TEXT NOT NULL,
    "instructions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_exams_user_id" ON "exams"("user_id");

-- CreateIndex
CREATE INDEX "idx_exams_patient_id" ON "exams"("patient_id");

-- CreateIndex
CREATE INDEX "idx_exams_exam_type_id" ON "exams"("exam_type_id");

-- CreateIndex
CREATE INDEX "idx_exams_status" ON "exams"("status");

-- CreateIndex
CREATE INDEX "idx_appointments_patient_id" ON "appointments"("patient_id");

-- CreateIndex
CREATE INDEX "idx_appointments_user_id" ON "appointments"("user_id");

-- CreateIndex
CREATE INDEX "idx_appointments_created_by" ON "appointments"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "vital_signs_appointment_id_key" ON "vital_signs"("appointment_id");

-- CreateIndex
CREATE INDEX "idx_vital_signs_appointment_id" ON "vital_signs"("appointment_id");

-- CreateIndex
CREATE INDEX "idx_vital_signs_patient_id" ON "vital_signs"("patient_id");

-- CreateIndex
CREATE INDEX "idx_vital_signs_recorded_by_id" ON "vital_signs"("recorded_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalHistory_appointment_id_key" ON "MedicalHistory"("appointment_id");

-- CreateIndex
CREATE INDEX "MedicalHistory_patient_id_visit_date_idx" ON "MedicalHistory"("patient_id", "visit_date");

-- CreateIndex
CREATE INDEX "MedicalHistory_doctor_id_visit_date_idx" ON "MedicalHistory"("doctor_id", "visit_date");

-- CreateIndex
CREATE INDEX "idx_dental_histories_patient_id" ON "dental_histories"("patient_id");

-- CreateIndex
CREATE INDEX "idx_dental_histories_doctor_id" ON "dental_histories"("doctor_id");

-- CreateIndex
CREATE INDEX "idx_dental_histories_appointment_id" ON "dental_histories"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "odontograms_dental_history_id_key" ON "odontograms"("dental_history_id");

-- CreateIndex
CREATE INDEX "odontograms_dental_history_id_idx" ON "odontograms"("dental_history_id");

-- CreateIndex
CREATE INDEX "idx_teeth_odontogram_id" ON "teeth"("odontogramId");

-- CreateIndex
CREATE UNIQUE INDEX "teeth_odontogramId_tooth_number_key" ON "teeth"("odontogramId", "tooth_number");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_prescription_number_key" ON "prescriptions"("prescription_number");

-- CreateIndex
CREATE INDEX "idx_prescriptions_medical_history_id" ON "prescriptions"("medical_history_id");

-- CreateIndex
CREATE INDEX "idx_prescriptions_patient_id" ON "prescriptions"("patient_id");

-- CreateIndex
CREATE INDEX "idx_prescriptions_doctor_id" ON "prescriptions"("doctor_id");

-- CreateIndex
CREATE INDEX "idx_prescription_items_prescription_id" ON "prescription_items"("prescription_id");

-- CreateIndex
CREATE INDEX "idx_prescription_items_medication_id" ON "prescription_items"("medication_id");

-- CreateIndex
CREATE INDEX "idx_account_payable_payments_account_id" ON "account_payable_payments"("accounts_payable_id");

-- CreateIndex
CREATE INDEX "idx_account_receivables_patient_id" ON "account_receivables"("patient_id");

-- CreateIndex
CREATE INDEX "idx_accounts_payable_patient_id" ON "accounts_payable"("patient_id");

-- CreateIndex
CREATE INDEX "idx_answers_patient_survey_id" ON "answers"("patient_survey_id");

-- CreateIndex
CREATE INDEX "idx_answers_question_id" ON "answers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "answers_patient_survey_id_question_id_key" ON "answers"("patient_survey_id", "question_id");

-- CreateIndex
CREATE INDEX "idx_exam_types_exam_category_id" ON "exam_types"("exam_category_id");

-- CreateIndex
CREATE INDEX "idx_medications_category_id" ON "medications"("category_id");

-- CreateIndex
CREATE INDEX "idx_patient_allergies_patient_id" ON "patient_allergies"("patient_id");

-- CreateIndex
CREATE INDEX "idx_patient_allergies_allergy_type_id" ON "patient_allergies"("allergy_type_id");

-- CreateIndex
CREATE INDEX "idx_patient_surveys_patient_id" ON "patient_surveys"("patient_id");

-- CreateIndex
CREATE INDEX "idx_patient_surveys_survey_id" ON "patient_surveys"("survey_id");

-- CreateIndex
CREATE INDEX "idx_payments_account_receivable_id" ON "payments"("account_receivable_id");

-- CreateIndex
CREATE INDEX "idx_questions_survey_id" ON "questions"("survey_id");

-- AddForeignKey
ALTER TABLE "patient_allergies" ADD CONSTRAINT "patient_allergies_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_allergies" ADD CONSTRAINT "patient_allergies_allergy_type_id_fkey" FOREIGN KEY ("allergy_type_id") REFERENCES "allergies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_surveys" ADD CONSTRAINT "patient_surveys_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_surveys" ADD CONSTRAINT "patient_surveys_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_patient_survey_id_fkey" FOREIGN KEY ("patient_survey_id") REFERENCES "patient_surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "medication_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_receivables" ADD CONSTRAINT "account_receivables_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_account_receivable_id_fkey" FOREIGN KEY ("account_receivable_id") REFERENCES "account_receivables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_payable" ADD CONSTRAINT "accounts_payable_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_payable_payments" ADD CONSTRAINT "account_payable_payments_accounts_payable_id_fkey" FOREIGN KEY ("accounts_payable_id") REFERENCES "accounts_payable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_types" ADD CONSTRAINT "exam_types_exam_category_id_fkey" FOREIGN KEY ("exam_category_id") REFERENCES "exam_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_exam_type_id_fkey" FOREIGN KEY ("exam_type_id") REFERENCES "exam_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dental_histories" ADD CONSTRAINT "dental_histories_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dental_histories" ADD CONSTRAINT "dental_histories_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dental_histories" ADD CONSTRAINT "dental_histories_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odontograms" ADD CONSTRAINT "odontograms_dental_history_id_fkey" FOREIGN KEY ("dental_history_id") REFERENCES "dental_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teeth" ADD CONSTRAINT "teeth_odontogramId_fkey" FOREIGN KEY ("odontogramId") REFERENCES "odontograms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medical_history_id_fkey" FOREIGN KEY ("medical_history_id") REFERENCES "MedicalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
