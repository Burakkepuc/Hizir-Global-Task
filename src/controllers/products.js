const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const rabbitMQ = require('../config/rabbitmq')


const createProduct = async (req, res, next) => {
  try {
    const { product_name } = req.body;

    await rabbitMQ.publishToQueue('product_queue', {
      product_name,
      timestamp: new Date(),
    })
    res.json({ success: true, message: "Product creation request received and processed in queue" });

  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
}

const createVariants = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const productExists = await prisma.products.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!productExists) {
      return next({ statusCode: 401, message: 'Product not found' });
    }

    const variants = req.body;

    const createdVariants = await Promise.all(variants.map(async variant => {
      const { sku, slug, stock, price, attributes } = variant;

      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: parseInt(productId),
          sku,
          slug,
          stock,
          price
        }
      });


      await Promise.all(
        attributes.map(async attribute => {
          const { attribute_id, attribute_value_id } = attribute;
          await prisma.variantAttribute.create({
            data: {
              attribute_id,
              attribute_value_id,
              product_variant_id: createdVariant.id,
            },
          });
        })
      );


      return createdVariant;
    }));

    res.status(201).json({ success: true, data: createdVariants });

  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};
const getAllProducts = async (req, res, next) => {
  try {
    // const products = await prisma.productVariant.findMany({
    //   select: {
    //     id: true,
    //     productId: true,
    //     sku: true,
    //     slug: true,
    //     stock: true,
    //     price: true,
    //     product: {
    //       select: {
    //         id: true,
    //         name: true,
    //       }
    //     }
    //   }
    // });

    const variantAttributes = await prisma.variantAttribute.findMany({
      include: {
        attribute: true,
        attributeValue: true,
        productVariant: {
          include: {
            product: true
          }
        },
      }
    });






    res.status(200).json({ success: true, data: variantAttributes });

  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};




module.exports = { createProduct, createVariants, getAllProducts };