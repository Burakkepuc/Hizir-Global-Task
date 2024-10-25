const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const rabbitMQ = require('../config/rabbitmq')
const redisClient = require('../config/redis')


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

    // const createdVariants = await Promise.all(variants.map(async variant => {
    //   const { sku, slug, stock, price, attributes } = variant;

    //   const createdVariant = await prisma.productVariant.create({
    //     data: {
    //       productId: parseInt(productId),
    //       sku,
    //       slug,
    //       stock,
    //       price
    //     }
    //   });


    //   await Promise.all(
    //     attributes.map(async attribute => {
    //       const { attribute_id, attribute_value_id } = attribute;
    //       await prisma.variantAttribute.create({
    //         data: {
    //           attribute_id,
    //           attribute_value_id,
    //           product_variant_id: createdVariant.id,
    //         },
    //       });
    //     })
    //   );


    //   return createdVariant;
    // }));


    await rabbitMQ.publishToQueue('variant_queue', {
      productId,
      variants,
      timestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Variant creation request received and processed in queue"
    });

  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const cacheKey = "all_product_variant_attributes"
    const cachedData = await redisClient.getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({ type: true, data: cachedData, message: 'Product variants fetched from cache' });
    }

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

    await redisClient.setCache(cacheKey, variantAttributes, 7200)




    return res.status(200).json({ success: true, data: variantAttributes });

  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};




module.exports = { createProduct, createVariants, getAllProducts };