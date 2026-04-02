-- AlterTable
ALTER TABLE "time_entries" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';

-- AlterTable: remove default after adding column
ALTER TABLE "time_entries" ALTER COLUMN "description" DROP DEFAULT;