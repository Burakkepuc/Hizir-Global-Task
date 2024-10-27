const ProductService = require('../services/product');
const ProductValidation = require('../validations/products');

const createProduct = async (req, res, next) => {
  try {
    const { error } = ProductValidation.validateCreateProduct(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const result = await ProductService.createProduct(req.body);
    res.json(result);
  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};

const createVariants = async (req, res, next) => {
  try {
    const { error } = ProductValidation.validateCreateVariants(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { productId } = req.params;
    const result = await ProductService.createVariants(productId, req.body);
    res.json(result);
  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const result = await ProductService.getAllProducts();
    res.json(result);
  } catch (error) {
    next({ statusCode: 500, message: error.message });
  }
};

module.exports = { createProduct, createVariants, getAllProducts };
