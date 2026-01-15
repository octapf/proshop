# ProShop - Modern E-Commerce Platform

A full-featured, production-ready E-commerce application built with the latest web technologies. This project demonstrates a scalable architecture, secure payment processing, and a seamless user experience.

## 🚀 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: SCSS, React Bootstrap
- **Backend**: Next.js API Routes (Serverless)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Payments**: 
  - [PayPal](https://developer.paypal.com/)
  - [Mercado Pago](https://www.mercadopago.com/)
- **Internationalization**: next-intl

## ✨ Features

### 🛍️ User Features
- **Product Catalog**: Browsing with pagination and search functionality.
- **Shopping Cart**: Dynamic cart management.
- **Checkout Process**: Multi-step checkout (Shipping, Payment Method, Confirmation).
- **User Accounts**: Registration, login (Auth), and profile management.
- **Order History**: View past orders and payment status.
- **Reviews**: Product rating and review system.
- **Multicurrency/Multilingual**: Support for EN/ES/IT (Architecture ready).

### 🛡️ Admin Features
- **User Management**: View, edit, and delete users.
- **Product Management**: Create, update, and delete products.
- **Order Management**: View all orders and update delivery status.
- **Secure Access**: Protected routes for admin-only operations.

### 💳 Payment Integration
- **PayPal**: Secure checkout using `@paypal/react-paypal-js`.
- **Mercado Pago**: Integrated Wallet for Latin American markets.

## 🛠️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PAYPAL_CLIENT_ID=<your_paypal_client_id>
MERCADOPAGO_PUBLIC_KEY=<your_mercadopago_public_key>
MERCADOPAGO_ACCESS_TOKEN=<your_mercadopago_access_token>
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📦 Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/proshop.git
   cd proshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📄 License

This project is licensed under the MIT License.
