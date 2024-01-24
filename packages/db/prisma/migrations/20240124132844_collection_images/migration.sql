/*
  Warnings:

  - A unique constraint covering the columns `[defaultImageId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "defaultImageId" TEXT;

-- CreateTable
CREATE TABLE "CollectionImage" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "externalImageId" TEXT NOT NULL,
    "thumbhash" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollectionImage_collectionId_idx" ON "CollectionImage"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_defaultImageId_key" ON "Collection"("defaultImageId");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_defaultImageId_fkey" FOREIGN KEY ("defaultImageId") REFERENCES "CollectionImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
