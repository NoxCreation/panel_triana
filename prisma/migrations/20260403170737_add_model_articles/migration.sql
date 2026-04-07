-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "thumbnail" VARCHAR(250) NOT NULL,
    "mini_description" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_title_key" ON "articles"("title");

-- CreateIndex
CREATE UNIQUE INDEX "articles_mini_description_key" ON "articles"("mini_description");
