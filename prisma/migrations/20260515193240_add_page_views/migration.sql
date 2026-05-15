-- CreateTable
CREATE TABLE "page_views" (
    "id" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "country" VARCHAR(100),
    "url" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_createdAt_idx" ON "page_views"("createdAt");

-- CreateIndex
CREATE INDEX "page_views_url_idx" ON "page_views"("url");

-- CreateIndex
CREATE INDEX "page_views_sessionId_idx" ON "page_views"("sessionId");
