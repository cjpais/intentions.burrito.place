/*
  Warnings:

  - You are about to drop the column `isProgress` on the `Completions` table. All the data in the column will be lost.
  - Added the required column `related` to the `Completions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Completions" DROP COLUMN "isProgress",
ADD COLUMN     "related" BOOLEAN NOT NULL;
