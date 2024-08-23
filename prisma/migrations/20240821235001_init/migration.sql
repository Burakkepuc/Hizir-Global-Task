-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValues" (
    "id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantAttribute" (
    "id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VariantAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductVariantToProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AttributeValuesToVariantAttribute" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValues_attribute_id_name_key" ON "AttributeValues"("attribute_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductVariantToProducts_AB_unique" ON "_ProductVariantToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductVariantToProducts_B_index" ON "_ProductVariantToProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeValuesToVariantAttribute_AB_unique" ON "_AttributeValuesToVariantAttribute"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeValuesToVariantAttribute_B_index" ON "_AttributeValuesToVariantAttribute"("B");

-- AddForeignKey
ALTER TABLE "AttributeValues" ADD CONSTRAINT "AttributeValues_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductVariantToProducts" ADD CONSTRAINT "_ProductVariantToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductVariantToProducts" ADD CONSTRAINT "_ProductVariantToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValuesToVariantAttribute" ADD CONSTRAINT "_AttributeValuesToVariantAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValuesToVariantAttribute" ADD CONSTRAINT "_AttributeValuesToVariantAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
