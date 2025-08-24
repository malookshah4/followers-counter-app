-- CreateTable
CREATE TABLE "public"."VerificationTicket" (
    "id" TEXT NOT NULL,
    "initialCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "VerificationTicket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."VerificationTicket" ADD CONSTRAINT "VerificationTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationTicket" ADD CONSTRAINT "VerificationTicket_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
