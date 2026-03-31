-- CreateTable
CREATE TABLE "landing" (
    "id" UUID NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_pkey" PRIMARY KEY ("id")
);
