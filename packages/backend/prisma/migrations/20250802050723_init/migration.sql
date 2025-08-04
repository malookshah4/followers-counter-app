-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TikTokAccount" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar_url_100" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "refreshExpiresIn" INTEGER NOT NULL,
    "scope" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TikTokAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_display_name_key" ON "public"."TikTokAccount"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_userId_key" ON "public"."TikTokAccount"("userId");

-- AddForeignKey
ALTER TABLE "public"."TikTokAccount" ADD CONSTRAINT "TikTokAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
