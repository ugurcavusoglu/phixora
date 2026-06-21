-- AlterTable: add gems and referralCount with defaults
ALTER TABLE "User" ADD COLUMN "gems" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "referralCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: add referralCode as nullable first, backfill, then make required
ALTER TABLE "User" ADD COLUMN "referralCode" TEXT;
UPDATE "User" SET "referralCode" = gen_random_uuid()::text WHERE "referralCode" IS NULL;
ALTER TABLE "User" ALTER COLUMN "referralCode" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "referralCode" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
