-- CreateTable
CREATE TABLE "public"."AudioTrend" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HashtagTrend" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HashtagTrend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HashtagTrend_id_key" ON "public"."HashtagTrend"("id");

-- CreateIndex
CREATE UNIQUE INDEX "HashtagTrend_name_key" ON "public"."HashtagTrend"("name");
