const request = require('supertest');
const app = require('../src/index'); // Express uygulamanızın yolu

describe('POST /products', () => {
  it('should create a new product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        product_name: 'T-Shirt',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('T-Shirt');
  });


});


describe('POST /products/:productId/variants', () => {
  let productId = 1; // Enter productId by hand
  it('should create new variants for a product', async () => {

    if (!productId) {
      throw new Error('Product ID is not defined');
    }
    const response = await request(app)
      .post(`/products/${productId}/variants`)
      .send([
        {
          sku: 'VAR-001',
          slug: 'variant-1-red',
          stock: 50,
          price: 29.99,
          attributes: [
            { attribute_id: 1, attribute_value_id: 1 },
          ],
        },
      ])
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0].sku).toBe('VAR-001');
  });
});


describe('GET /products', () => {
  it('should return all products', async () => {
    const response = await request(app)
      .get('/products')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});