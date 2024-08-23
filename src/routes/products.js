var express = require('express');
const { createProduct, createVariants, getAllProducts } = require('../controllers/products');
var router = express.Router();

router.post('/', createProduct);
router.post('/:productId/variants', createVariants);
router.get('/', getAllProducts)

module.exports = router;