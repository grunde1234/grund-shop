/*
  Warnings:

  - You are about to drop the column `numberviews` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "numberviews",
ADD COLUMN     "numReviews" INTEGER NOT NULL DEFAULT 0;
