const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Test environment değişkenlerini ayarla
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';

describe('Products Endpoints', () => {
  let testCategory;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lavie-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    // Test kategorisi oluştur
    testCategory = await Category.create({
      name: 'Test Category',
      img: 'https://example.com/category.jpg'
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        img: ['https://example.com/product1.jpg'],
        colors: ['Red', 'Blue'],
        sizes: ['S', 'M', 'L'],
        price: {
          current: 99.99,
          discount: 10
        },
        category: testCategory._id,
        description: 'Test product description'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body.name).toBe(productData.name);
      expect(response.body.price.current).toBe(productData.price.current);
      expect(response.body.category).toBe(testCategory._id.toString());
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Test ürünleri oluştur
      await Product.create([
        {
          name: 'Product 1',
          img: ['https://example.com/product1.jpg'],
          colors: ['Red'],
          sizes: ['S'],
          price: { current: 50 },
          category: testCategory._id,
          description: 'Product 1 description'
        },
        {
          name: 'Product 2',
          img: ['https://example.com/product2.jpg'],
          colors: ['Blue'],
          sizes: ['M'],
          price: { current: 75 },
          category: testCategory._id,
          description: 'Product 2 description'
        }
      ]);
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/products/:productId', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name: 'Test Product',
        img: ['https://example.com/product.jpg'],
        colors: ['Red'],
        sizes: ['S'],
        price: { current: 50 },
        category: testCategory._id,
        description: 'Test description'
      });
    });

    it('should get a specific product', async () => {
      const response = await request(app)
        .get(`/api/products/${testProduct._id}`)
        .expect(200);

      expect(response.body.name).toBe('Test Product');
      expect(response.body._id).toBe(testProduct._id.toString());
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);
    });
  });

  describe('GET /api/products/search/:productName', () => {
    beforeEach(async () => {
      await Product.create([
        {
          name: 'iPhone 13',
          img: ['https://example.com/iphone.jpg'],
          colors: ['Black'],
          sizes: ['Standard'],
          price: { current: 999 },
          category: testCategory._id,
          description: 'iPhone 13 description'
        },
        {
          name: 'Samsung Galaxy',
          img: ['https://example.com/samsung.jpg'],
          colors: ['White'],
          sizes: ['Standard'],
          price: { current: 799 },
          category: testCategory._id,
          description: 'Samsung Galaxy description'
        }
      ]);
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products/search/iPhone')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toContain('iPhone');
    });
  });
}); 