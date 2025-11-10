/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surveys` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_optionId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_responseId_fkey";

-- DropForeignKey
ALTER TABLE "options" DROP CONSTRAINT "options_questionId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_surveyId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "answers";

-- DropTable
DROP TABLE "options";

-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "responses";

-- DropTable
DROP TABLE "surveys";

-- DropEnum
DROP TYPE "QuestionType";

-- DropEnum
DROP TYPE "SurveyStatus";

-- CreateTable
CREATE TABLE "summary_all_to_users" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "edad" INTEGER,
    "comidaFavorita" TEXT,
    "genero" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "summary_all_to_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "summary_all_to_users_correo_key" ON "summary_all_to_users"("correo");
