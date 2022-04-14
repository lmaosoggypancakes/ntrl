-- CreateTable
CREATE TABLE "Park" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dogabble" BOOLEAN NOT NULL,
    "activities" TEXT[],
    "transportation" TEXT[],
    "region" TEXT NOT NULL,
    "utilities" TEXT[],
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Park_pkey" PRIMARY KEY ("id")
);
