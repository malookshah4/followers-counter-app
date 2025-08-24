/*
  Warnings:

  - The values [PAUSED] on the enum `CampaignStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CampaignStatus_new" AS ENUM ('ACTIVE', 'COMPLETE');
ALTER TABLE "public"."Campaign" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Campaign" ALTER COLUMN "status" TYPE "public"."CampaignStatus_new" USING ("status"::text::"public"."CampaignStatus_new");
ALTER TYPE "public"."CampaignStatus" RENAME TO "CampaignStatus_old";
ALTER TYPE "public"."CampaignStatus_new" RENAME TO "CampaignStatus";
DROP TYPE "public"."CampaignStatus_old";
ALTER TABLE "public"."Campaign" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Campaign" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "public"."PromoPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CampaignType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "costInStars" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoPackage_pkey" PRIMARY KEY ("id")
);
