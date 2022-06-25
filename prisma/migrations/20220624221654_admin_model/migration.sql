/*
  Warnings:

  - You are about to drop the column `visits` on the `Park` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Park" DROP COLUMN "visits";

-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "visited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parkId" INTEGER,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "Park"("id") ON DELETE SET NULL ON UPDATE CASCADE;
