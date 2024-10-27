const { Router } = require('express');
const { createProduct, createVariants, getAllProducts } = require('../controllers/products');
const router = Router();

router.post('/', createProduct);
router.post('/:productId/variants', createVariants);
router.get('/', getAllProducts);

module.exports = router;
