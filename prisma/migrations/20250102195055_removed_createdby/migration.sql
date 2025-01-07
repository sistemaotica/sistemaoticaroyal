/*
  Warnings:

  - You are about to drop the column `createdById` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_createdById_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "createdById";
