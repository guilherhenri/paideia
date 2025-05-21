/*
  Warnings:

  - The values [GMAIL] on the enum `AccountProvider` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `provider_type` on the `lessons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('youtube', 'panda');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountProvider_new" AS ENUM ('GITHUB');
ALTER TABLE "accounts" ALTER COLUMN "provider" TYPE "AccountProvider_new" USING ("provider"::text::"AccountProvider_new");
ALTER TYPE "AccountProvider" RENAME TO "AccountProvider_old";
ALTER TYPE "AccountProvider_new" RENAME TO "AccountProvider";
DROP TYPE "AccountProvider_old";
COMMIT;

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "provider_type",
ADD COLUMN     "provider_type" "VideoProvider" NOT NULL;

-- DropEnum
DROP TYPE "ProviderType";
