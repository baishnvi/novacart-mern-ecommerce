# NovaCart — Modern E-Commerce Platform

A full-stack MERN e-commerce platform with a premium, minimal UI inspired by Apple, Nike, and Zara. Built with React 19, Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)

---

## ✨ Features

- **Authentication** — JWT access + refresh tokens, role-based access (customer/admin), email verification, password reset
- **Product Catalog** — search, category/brand/price/rating filters, sorting, pagination
- **Product Details** — image gallery, color/size variants, reviews & ratings, related products
- **Cart & Wishlist** — persistent cart, coupon codes, real-time totals
- **Checkout** — Stripe payment integration, saved addresses, order summary
- **User Dashboard** — order history & tracking, wishlist, profile settings, saved addresses
- **Admin Dashboard** — revenue/order analytics with charts, product management (CRUD + image upload), order status management
- **UI/UX** — dark mode, sticky navbar, floating mini-cart, skeleton loaders, smooth animations, fully responsive

---

## 🛠 Tech Stack

**Frontend:** React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Chart.js, React Hook Form, Stripe Elements

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer, Cloudinary, Stripe, Nodemailer

---

## 📁 Project Structure

```
novacart/
├── server/              # Backend (Express API)
│   ├── config/          # DB, Cloudinary, Stripe configuration
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth, error handling, validation, upload
│   ├── models/          # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/          # API route definitions
│   ├── utils/           # Helpers (JWT, API responses, seeder, etc.)
│   ├── validators/      # express-validator rules
│   ├── app.js           # Express app configuration
│   └── server.js         # Entry point
│
└── client/              # Frontend (React + Vite)
    └── src/
        ├── app/          # Redux store
        ├── features/     # Redux slices (auth, cart, wishlist, ui)
        ├── services/     # API service layer (axios)
        ├── components/   # Reusable UI, layout, product components
        ├── pages/        # Route-level pages (public, dashboard, admin)
        ├── routes/       # Protected/Admin route guards
        └── hooks/        # Custom React hooks
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A MongoDB database — either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud, free tier) or a local install
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)
- A free [Stripe](https://stripe.com) account (for payments, Test Mode)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd novacart
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env` with your own values:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_random_secret
JWT_REFRESH_SECRET=your_random_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

COOKIE_SECRET=your_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

Seed the database with sample data (creates an admin account + demo products):

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔑 Default Admin Login

After running `npm run seed`:

```
Email:    admin@novacart.com
Password: Admin@12345
```

Access the admin dashboard at `/admin`.

---

## 💳 Testing Payments

Use Stripe's test card at checkout (Test Mode only — no real charges):

```
Card Number: 4242 4242 4242 4242
Expiry:      Any future date
CVC:         Any 3 digits
ZIP:         Any 5 digits
```

---

## 📜 Available Scripts

**Backend** (`server/`)
| Command | Description |
|---|---|
| `npm run dev` | Start backend in development mode (auto-restart) |
| `npm run seed` | Seed database with sample admin, categories, brands, products |
| `npm start` | Start backend in production mode |

**Frontend** (`client/`)
| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---
## Some Output Image
<img width="1366" height="768" alt="Screenshot (366)" src="https://github.com/user-attachments/assets/888c9cb1-c17a-4b1a-bdf6-48349b1460ba" />

<img width="1366" height="768" alt="Screenshot (364)" src="https://github.com/user-attachments/assets/c243a68b-5a37-4ad0-b7d5-da2d24e59022" />

<img width="1366" height="768" alt="Screenshot (367)" src="https://github.com/user-attachments/assets/3bd378ee-16ea-414e-8062-a6821e17495f" />



---
## 📄 License

This project is available for personal and educational use.
