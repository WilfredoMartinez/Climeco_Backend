-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('MINUTES', 'HOURS', 'DAYS');

-- CreateTable
CREATE TABLE "exam_types" (
    "id" TEXT NOT NULL,
    "exam_category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "duration_time_unit" "TimeUnit" NOT NULL DEFAULT 'MINUTES',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exam_types_name_key" ON "exam_types"("name");

-- CreateIndex
CREATE INDEX "idx_exam_types_exam_category_id" ON "exam_types"("exam_category_id");

-- CreateIndex
CREATE INDEX "idx_exam_types_name" ON "exam_types"("name");

-- AddForeignKey
ALTER TABLE "exam_types" ADD CONSTRAINT "exam_types_exam_category_id_fkey" FOREIGN KEY ("exam_category_id") REFERENCES "exam_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
