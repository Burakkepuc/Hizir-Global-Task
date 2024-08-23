# Hızır Global A.Ş

Bu proje, Hızır Global AŞ için bir ürün ve ürün varyantları yönetim sistemi sağlar. Proje, Express.js ve Prisma ORM kullanılarak geliştirilmiştir.

## Proje Yapısı

```
|—— .env
|—— .gitignore
|—— db_architecture
|    |—— ER_DIAGRAM.PNG
|—— package-lock.json
|—— package.json
|—— prisma
|    |—— migrations
|    |—— schema.prisma
|    |—— seed.js
|—— src
|    |—— controllers
|        |—— products.js
|    |—— index.js
|    |—— middlewares
|        |—— error.js
|        |—— notFound.js
|    |—— README.md
|    |—— routes
|        |—— index.js
|        |—— products.js
|    |—— utils
|—— __test__
|    |—— products.test.js
```

## Kurulum

1. **Bağımlılıkları Yükleyin:**

   ```bash
   npm install
   ```

2. **Veritabanı Yapılandırmasını Yapın:**

   Veritabanı yapılandırmasını `.env` dosyasında yapın. Bu dosya, veritabanı bağlantı bilgilerini içermelidir.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

```

3. **Prisma Veritabanı Migrations:**

   Prisma veritabanı şemasını güncellemek için aşağıdaki komutları çalıştırın:

   ```bash
   npx prisma migrate dev
   ```

4. **Veritabanını Seed Etme:**

   Örnek verilerle veritabanını doldurmak için:

   ```bash
   npm run seed
   ```

5. **Uygulamayı Başlatın:**

   ```bash
   npm run dev
   ```

## API Endpoints

### 1. Ürün Oluşturma

**POST** `/products`

**Request Body:**

```json
{
  "product_name": "T-Shirt"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "T-Shirt",
    "created_at": "2024-08-23T00:35:28.799Z",
    "updated_at": "2024-08-23T00:35:28.799Z"
  }
}
```

### 2. Ürün Varyantları Ekleme

**POST** `/products/:productId/variants`

**Request Body:**

```json
[
  {
    "sku": "TS-001",
    "slug": "t-shirt-small-green",
    "stock": 100,
    "price": 19.99,
    "attributes": [
      {
        "attribute_id": 2,
        "attribute_value_id": 4
      },
      {
        "attribute_id": 1,
        "attribute_value_id": 2
      }
    ]
  },
  {
    "sku": "TS-002",
    "slug": "t-shirt-large-cotton",
    "stock": 100,
    "price": 19.99,
    "attributes": [
      {
        "attribute_id": 2,
        "attribute_value_id": 6
      },
      {
        "attribute_id": 3,
        "attribute_value_id": 8
      }
    ]
  }
]
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "productId": 1,
      "sku": "TS-001",
      "slug": "t-shirt-small-green",
      "stock": 100,
      "price": 19.99,
      "createdAt": "2024-08-23T00:42:24.158Z",
      "updatedAt": "2024-08-23T00:42:24.158Z"
    },
    {
      "id": 4,
      "productId": 1,
      "sku": "TS-002",
      "slug": "t-shirt-large-cotton",
      "stock": 100,
      "price": 19.99,
      "createdAt": "2024-08-23T00:42:24.158Z",
      "updatedAt": "2024-08-23T00:42:24.158Z"
    }
  ]
}
```

### 3. Tüm Ürünleri Getirme

**GET** `/products`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "attribute_value_id": 2,
      "attribute_id": 1,
      "product_variant_id": 2,
      "created_at": "2024-08-23T00:41:58.496Z",
      "updated_at": "2024-08-23T00:41:58.496Z",
      "attribute": {
        "id": 1,
        "name": "Color",
        "created_at": "2024-08-23T00:31:27.534Z",
        "updated_at": "2024-08-23T00:31:27.534Z"
      },
      "attributeValue": {
        "id": 2,
        "attribute_id": 1,
        "name": "Green",
        "created_at": "2024-08-23T00:31:27.546Z",
        "updated_at": "2024-08-23T00:31:27.546Z"
      },
      "productVariant": {
        "id": 2,
        "productId": 1,
        "sku": "TS-001",
        "slug": "t-shirt-small-green",
        "stock": 100,
        "price": 19.99,
        "createdAt": "2024-08-23T00:41:58.482Z",
        "updatedAt": "2024-08-23T00:41:58.482Z",
        "product": {
          "id": 1,
          "name": "T-Shirt",
          "created_at": "2024-08-23T00:35:28.799Z",
          "updated_at": "2024-08-23T00:35:28.799Z"
        }
      }
    }
  ]
}
```

## Testler

Testler, proje kök dizininde bulunan `__test__/products.test.js` dosyasında tanımlanmıştır. Testler, Express.js rotalarını test eder ve veritabanı etkileşimlerini kontrol eder.

5. **Uygulamayı Test Edin:**

   ```bash
   npm test
   ```
