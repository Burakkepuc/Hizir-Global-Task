const crypto = require('crypto');


class GeneralHelpers {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'securekey123@';
  }

  encrypt(data) {
    try {
      const jsonData = JSON.stringify(data);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey),
        iv
      );

      let encrypted = cipher.update(jsonData, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const result = `${iv.toString('hex')}:${encrypted}`;
      return Buffer.from(result).toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  decrypt(encryptedData) {
    try {
      const buffer = Buffer.from(encryptedData, 'base64').toString();
      const [ivHex, encryptedHex] = buffer.split(':');
      const iv = Buffer.from(ivHex, 'hex');

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey),
        iv
      );

      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}

const generalHelpers = new GeneralHelpers();

module.exports = generalHelpers;