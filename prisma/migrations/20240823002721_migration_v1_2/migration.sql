/*
  Warnings:

  - Added the required column `attribute_value_id` to the `VariantAttribute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VariantAttribute" DROP CONSTRAINT "VariantAttribute_attribute_id_fkey";

-- AlterTable
ALTER TABLE "VariantAttribute" ADD COLUMN     "attribute_value_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "VariantAttribute" ADD CONSTRAINT "VariantAttribute_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttribute" ADD CONSTRAINT "VariantAttribute_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "AttributeValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
