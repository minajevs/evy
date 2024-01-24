-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_defaultImageId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionImage" DROP CONSTRAINT "CollectionImage_collectionId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "defaultImageId";

-- DropTable
DROP TABLE "CollectionImage";

