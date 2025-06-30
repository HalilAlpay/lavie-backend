# LaVie E-Commerce Backend API

Modern e-ticaret platformu için RESTful API backend servisi.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **Ürün Yönetimi**: CRUD işlemleri, arama, kategorilendirme
- **Kategori Yönetimi**: Ürün kategorileri
- **Kupon Sistemi**: İndirim kuponları
- **Ödeme Entegrasyonu**: Stripe ile güvenli ödeme
- **Güvenlik**: JWT authentication, rate limiting, input validation
- **Test Altyapısı**: Jest ile kapsamlı testler

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB
- npm veya yarn

## 🛠️ Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd lavie-backend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
MONGO_URI=mongodb://localhost:27017/lavie-backend
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
CLIENT_DOMAIN=https://lavie-frontend.netlify.app
PORT=5000
```

4. **Uygulamayı başlatın**
```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 Testler

```bash
# Tüm testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm run test:watch
```

## 📚 API Dokümantasyonu

### Authentication

#### POST /api/auth/register
Yeni kullanıcı kaydı.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "username": "john_doe",
  "avatar": "https://i.pravatar.cc/300?img=1",
  "token": "jwt_token"
}
```

#### POST /api/auth/login
Kullanıcı girişi.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "username": "john_doe",
  "avatar": "https://i.pravatar.cc/300?img=1",
  "token": "jwt_token"
}
```

#### GET /api/auth/profile
Kullanıcı profili (Authentication gerekli).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Products

#### GET /api/products
Tüm ürünleri listele.

#### POST /api/products
Yeni ürün oluştur (Admin gerekli).

**Request Body:**
```json
{
  "name": "iPhone 13",
  "img": ["https://example.com/iphone.jpg"],
  "colors": ["Black", "White"],
  "sizes": ["128GB", "256GB"],
  "price": {
    "current": 999,
    "discount": 50
  },
  "category": "category_id",
  "description": "Latest iPhone model"
}
```

#### GET /api/products/:productId
Belirli bir ürünü getir.

#### PUT /api/products/:productId
Ürün güncelle (Admin gerekli).

#### DELETE /api/products/:productId
Ürün sil (Admin gerekli).

#### GET /api/products/search/:productName
Ürün arama.

### Categories

#### GET /api/categories
Tüm kategorileri listele.

#### POST /api/categories
Yeni kategori oluştur (Admin gerekli).

**Request Body:**
```json
{
  "name": "Electronics",
  "img": "https://example.com/electronics.jpg"
}
```

### Coupons

#### GET /api/coupons
Tüm kuponları listele.

#### POST /api/coupons
Yeni kupon oluştur (Admin gerekli).

**Request Body:**
```json
{
  "code": "SAVE20",
  "discountPercent": 20
}
```

#### GET /api/coupons/code/:couponCode
Kupon kodu ile kupon bilgisi getir.

### Payment

#### POST /api/payment
Stripe ödeme oturumu oluştur.

**Request Body:**
```json
{
  "products": [
    {
      "name": "iPhone 13",
      "price": 999,
      "quantity": 1
    }
  ],
  "user": {
    "email": "john@example.com"
  },
  "cargoFee": 10
}
```

## 🔒 Güvenlik

- **JWT Authentication**: Tüm korumalı endpoint'ler için
- **Rate Limiting**: IP başına 15 dakikada 100 istek
- **Input Validation**: Tüm giriş verileri validate edilir
- **Helmet**: Güvenlik header'ları
- **CORS**: Cross-origin resource sharing koruması

## 🏗️ Proje Yapısı

```
lavie-backend/
├── models/          # MongoDB modelleri
├── routes/          # API route'ları
├── middleware/      # Custom middleware'ler
├── tests/           # Test dosyaları
├── server.js        # Ana uygulama dosyası
├── package.json     # Proje bağımlılıkları
└── README.md        # Bu dosya
```

## 🚀 Deployment

### Heroku
```bash
heroku create lavie-backend
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_key
git push heroku main
```

### Vercel
```bash
npm install -g vercel
vercel
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Email: your-email@example.com
- GitHub: [@your-username](https://github.com/your-username) 