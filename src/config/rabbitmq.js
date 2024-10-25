const amqp = require('amqplib');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RabbitMQ {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.queueConnected = false;
  }

  async connectQueue() {
    try {
      if (!this.queueConnected) {

        const connection = await amqp.connect("amqp://localhost:5672");
        this.channel = await connection.createChannel();

        this.queueConnected = true;
        console.log("RabbitMQ connection is successfull");
      }
    } catch (error) {
      console.log("RabbitMQ connection has some error: ", error);
    }
  }

  async assertQueue(queueName) {
    try {
      if (!this.queueConnected) {
        await this.connectQueue();
      }
      await this.channel.assertQueue(queueName);
      console.log(`Queue "${queueName}" is ready.`);
    } catch (error) {
      console.log(`Queue "${queueName}" cannot be asserted:`, error);

    }
  }


  async publishToQueue(queueName, data) {
    try {
      await this.assertQueue(queueName);
      await this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
      console.log(`Message has been sent to queue "${queueName}"`);
    } catch (error) {
      console.log(`Message has not been sent to queue "${queueName}"`, error);
    }
  }

  async consumeFromQueue(queueName) {

    try {
      await this.assertQueue(queueName);
      await this.channel.consume(queueName, async (data) => {
        try {
          if (data === null) return

          const { product_name } = JSON.parse(data.content.toString());
          const createProduct = await prisma.products.create({
            data: {
              name: product_name,
            },
          });
          console.log('Product created successfully: ', createProduct);
          this.channel.ack(data);
        } catch (error) {
          console.log('Product has not created: ', error);
          this.channel.nack(data);
        }
      });
    } catch (error) {
      console.log('Message has not been consumed from the queue. ', error);
    }
  }

  async consumeFromVariantQueue(queueName) {
    try {
      await this.assertQueue(queueName);
      await this.channel.consume(queueName, async (data) => {
        try {
          if (data === null) return
          const { productId, variants } = JSON.parse(data.content.toString());

          const createdVariants = await Promise.all(
            variants.map(async variant => {
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

          console.log('Variants created successfully: ', createdVariants);
          this.channel.ack(data);

        } catch (error) {
          console.log('Product variant has not created: ', error);
          this.channel.nack(data);
        }
      })

    } catch (error) {
      console.log('Message has not been consumed from the variant queue. ', error);

    }

  }


}
const rabbitMQ = new RabbitMQ();

module.exports = rabbitMQ;