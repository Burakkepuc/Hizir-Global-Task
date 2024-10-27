const Joi = require('joi');

class ProductValidation {
  static validateCreateProduct(data) {
    const schema = Joi.object({
      product_name: Joi.string().trim().min(3).required(),
    });
    return schema.validate(data);
  }

  static validateCreateVariants(data) {
    const schema = Joi.array().items(
      Joi.object({
        sku: Joi.string().trim().required(),
        slug: Joi.string().trim().required(),
        stock: Joi.number().integer().required(),
        price: Joi.number().required(),
        attributes: Joi.array().items(
          Joi.object({
            attribute_id: Joi.number().integer().required(),
            attribute_value_id: Joi.number().integer().required()
          })
        ).required()
      })
    );
    return schema.validate(data);
  }
}

module.exports = ProductValidation;

