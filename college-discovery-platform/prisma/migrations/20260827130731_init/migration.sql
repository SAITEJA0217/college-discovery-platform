-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('PUBLIC', 'PRIVATE', 'GOVERNMENT', 'AUTONOMOUS');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('JEE_MAIN', 'JEE_ADVANCED', 'BITSAT', 'STATE_CET', 'CUET');

-- CreateEnum
CREATE TYPE "StudentCategory" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS');

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "locationInfo" TEXT,
    "type" "CollegeType" NOT NULL,
    "description" TEXT,
    "annualFees" DECIMAL(10,2),
    "rating" DOUBLE PRECISION,
    "totalReviewCount" INTEGER NOT NULL DEFAULT 0,
    "avgPlacement" DECIMAL(10,2),
    "highestPlacement" DECIMAL(10,2),
    "placementPercent" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "durationYears" INTEGER NOT NULL,
    "fees" DECIMAL(10,2),
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "averagePackage" DECIMAL(10,2),
    "highestPackage" DECIMAL(10,2),
    "medianPackage" DECIMAL(10,2),
    "placementPercent" DOUBLE PRECISION,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamCutoff" (
    "id" TEXT NOT NULL,
    "exam" "ExamType" NOT NULL,
    "category" "StudentCategory" NOT NULL,
    "admissionYear" INTEGER NOT NULL,
    "openingRank" INTEGER,
    "closingRank" INTEGER NOT NULL,
    "collegeId" TEXT NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "ExamCutoff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_name_idx" ON "College"("name");

-- CreateIndex
CREATE INDEX "College_city_state_idx" ON "College"("city", "state");

-- CreateIndex
CREATE INDEX "College_rating_idx" ON "College"("rating");

-- CreateIndex
CREATE INDEX "College_annualFees_idx" ON "College"("annualFees");

-- CreateIndex
CREATE INDEX "Course_collegeId_idx" ON "Course"("collegeId");

-- CreateIndex
CREATE INDEX "Placement_collegeId_idx" ON "Placement"("collegeId");

-- CreateIndex
CREATE INDEX "Placement_year_idx" ON "Placement"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Placement_collegeId_year_key" ON "Placement"("collegeId", "year");

-- CreateIndex
CREATE INDEX "Review_collegeId_idx" ON "Review"("collegeId");

-- CreateIndex
CREATE INDEX "ExamCutoff_collegeId_idx" ON "ExamCutoff"("collegeId");

-- CreateIndex
CREATE INDEX "ExamCutoff_courseId_idx" ON "ExamCutoff"("courseId");

-- CreateIndex
CREATE INDEX "ExamCutoff_exam_category_closingRank_idx" ON "ExamCutoff"("exam", "category", "closingRank");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamCutoff" ADD CONSTRAINT "ExamCutoff_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamCutoff" ADD CONSTRAINT "ExamCutoff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
