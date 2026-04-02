-- Fill existing null values from the group description
UPDATE "time_entries" te
SET "description" = teg."description"
FROM "time_entry_groups" teg
WHERE te."group_id" = teg."id" AND te."description" IS NULL;

-- AlterTable
ALTER TABLE "time_entries" ALTER COLUMN "description" SET NOT NULL;