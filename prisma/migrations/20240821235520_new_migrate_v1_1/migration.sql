/*
  Warnings:

  - You are about to drop the `_AttributeValuesToVariantAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductVariantToProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AttributeValuesToVariantAttribute" DROP CONSTRAINT "_AttributeValuesToVariantAttribute_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttributeValuesToVariantAttribute" DROP CONSTRAINT "_AttributeValuesToVariantAttribute_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductVariantToProducts" DROP CONSTRAINT "_ProductVariantToProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductVariantToProducts" DROP CONSTRAINT "_ProductVariantToProducts_B_fkey";

-- DropTable
DROP TABLE "_AttributeValuesToVariantAttribute";

-- DropTable
DROP TABLE "_ProductVariantToProducts";

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttribute" ADD CONSTRAINT "VariantAttribute_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "AttributeValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttribute" ADD CONSTRAINT "VariantAttribute_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
