/*
  Warnings:

  - Changed the type of `region` on the `Park` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('Western', 'Southern', 'Northern');

-- AlterTable
ALTER TABLE "Park" ADD COLUMN     "visits" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "region",
ADD COLUMN     "region" "Region" NOT NULL;
