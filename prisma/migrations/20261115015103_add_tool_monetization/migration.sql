-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('none', 'basic', 'featured');

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "affiliateUrl" TEXT,
ADD COLUMN     "sponsorTier" "SponsorTier" NOT NULL DEFAULT 'none';
