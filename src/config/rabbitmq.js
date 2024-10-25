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

        await this.channel.assertQueue("product_queue");
        this.queueConnected = true;
        console.log("RabbitMQ connection is successfull");
      }
    } catch (error) {
      console.log("RabbitMQ connection has some error: ", error);
    }
  }

  async publishToQueue(queueName, data) {

    try {

      if (!this.queueConnected) {
        await this.connectQueue();
      }

      await this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
      console.log("Message has sent to the queue ");
    } catch (error) {
      console.log("Message has not sent to the queue", error);
    }
  }

  async consumeFromQueue(queueName) {

    try {
      if (!this.queueConnected) {
        await this.connectQueue();
      }

      await this.channel.consume(queueName, async (data) => {
        try {
          if (data !== null) {
            const { product_name } = JSON.parse(data.content.toString());
            const createProduct = await prisma.products.create({
              data: {
                name: product_name,
              },
            });
            console.log('Product created successfully: ', createProduct);
            this.channel.ack(data);
          }
        } catch (error) {
          console.log('Product has not created: ', error);
          this.channel.nack(data);
        }
      });
    } catch (error) {
      console.log('Message has not been consumed from the queue. ', error);
    }
  }



}
const rabbitMQ = new RabbitMQ();

module.exports = rabbitMQ;