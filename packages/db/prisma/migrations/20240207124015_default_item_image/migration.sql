/*
  Warnings:

  - A unique constraint covering the columns `[defaultImageId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "defaultImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Item_defaultImageId_key" ON "Item"("defaultImageId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_defaultImageId_fkey" FOREIGN KEY ("defaultImageId") REFERENCES "ItemImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
