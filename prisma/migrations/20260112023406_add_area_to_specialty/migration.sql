-- CreateEnum
CREATE TYPE "AreaType" AS ENUM ('MEDICINA_GENERAL', 'ODONTOLOGIA');

-- AlterTable
ALTER TABLE "specialties" ADD COLUMN     "area" "AreaType" NOT NULL DEFAULT 'MEDICINA_GENERAL';

-- CreateIndex
CREATE INDEX "idx_specialties_area" ON "specialties"("area");
