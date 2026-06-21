-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'free',
ALTER COLUMN "referralCode" DROP DEFAULT;
