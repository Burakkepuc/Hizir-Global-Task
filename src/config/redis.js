const { createClient } = require('redis');

class RedisClient {

  constructor() {
    this.client = createClient();
    this.connect();
  }


  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to Redis");
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  async getCache(key) {
    try {
      const data = await this.client.get(key);
      if (data) {
        console.log("Cache with key: ", key);
        return JSON.parse(data);
      } else {
        console.log("No cache found with key");
        return null;
      }
    } catch (error) {
      console.error("Error getting cache:", error);
      throw error;
    }
  }

  async setCache(key, value, duration = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', duration);
      console.log("Cache set to the key: ", key);
    } catch (error) {
      console.error("Error setting cache:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.disconnect();
      console.log("Disconnected from Redis");
    } catch (error) {
      console.error("Failed to disconnect from Redis:", error);
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;