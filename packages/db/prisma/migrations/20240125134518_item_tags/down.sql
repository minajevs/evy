
-- DropForeignKey
ALTER TABLE "ItemTag" DROP CONSTRAINT "ItemTag_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemTag" DROP CONSTRAINT "ItemTag_collectionId_fkey";

-- DropTable
DROP TABLE "ItemTag";

DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20240125123357_fix_itemtag_itemid_column_name';
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20240124192610_item_tags';

