
> @evy/db@0.1.0 with-env
> dotenv -e ../../.env -- prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_defaultImageId_fkey";

-- DropIndex
DROP INDEX "Item_defaultImageId_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "defaultImageId";

