/*
  Warnings:

  - Added the required column `text` to the `Entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entries" ADD COLUMN     "text" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Completions" (
    "id" SERIAL NOT NULL,
    "entryId" INTEGER NOT NULL,
    "intentionId" INTEGER NOT NULL,
    "isProgress" BOOLEAN NOT NULL,
    "why" TEXT NOT NULL,

    CONSTRAINT "Completions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Completions" ADD CONSTRAINT "Completions_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Completions" ADD CONSTRAINT "Completions_intentionId_fkey" FOREIGN KEY ("intentionId") REFERENCES "Intentions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
