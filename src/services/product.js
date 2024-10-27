const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const rabbitMQ = require('../config/rabbitmq');
const redisClient = require('../config/redis');

class ProductService {
  static async createProduct(data) {
    await rabbitMQ.publishToQueue('product_queue', {
      product_name: data.product_name,
      timestamp: new Date(),
    });

    await redisClient.delCache("all_product_variant_attributes");

    return { success: true, message: "Product creation request received and processed in queue" };
  }

  static async createVariants(productId, variants) {
    const productExists = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!productExists) {
      throw new Error('Product not found');
    }
    await redisClient.delCache("all_product_variant_attributes");

    await rabbitMQ.publishToQueue('variant_queue', {
      productId,
      variants,
      timestamp: new Date(),
    });


    return {
      success: true,
      message: "Variant creation request received and processed in queue"
    };
  }

  static async getAllProducts() {
    const cacheKey = "all_product_variant_attributes";
    const cachedData = await redisClient.getCache(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData, message: 'Product variants fetched from cache' };
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

    await redisClient.setCache(cacheKey, variantAttributes, 7200);
    return { success: true, data: variantAttributes };
  }
}

module.exports = ProductService;
