/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PromoPackage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."CampaignStatus" ADD VALUE 'PAUSED';

-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "type" "public"."CampaignType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role";

-- DropTable
DROP TABLE "public"."PromoPackage";

-- DropEnum
DROP TYPE "public"."Role";
