# 🛒 MultiVender - Full-Stack Multi-Vendor E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://multivender-pt6u.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Redux-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-orange?style=for-the-badge)](#license)

> An enterprise-grade, full-stack multi-vendor e-commerce platform built with **React 18**, **Node.js**, **Express 5**, **MongoDB**, **Socket.io**, and **Redux Toolkit**. Supports multi-role authentication (Buyer, Seller, Admin), real-time buyer-seller chat, multi-gateway payments (Stripe, PayPal, COD), timed flash sales events, coupon discounts, and comprehensive seller & admin management dashboards.

🌐 **Live Application Link:** [https://multivender-pt6u.vercel.app/](https://multivender-pt6u.vercel.app/)

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📐 System Architecture](#-system-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🔑 Environment Variables](#-environment-variables)
- [⚡ API Endpoints Summary](#-api-endpoints-summary)
- [💬 Real-Time Messaging Gateway](#-real-time-messaging-gateway)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 🛍️ Buyer Experience
- **Account Registration & Activation:** Secure sign-up with email activation tokens via Nodemailer.
- **Product Catalog & Search:** Real-time search with dynamic keyword suggestions, multi-category filtering, and price sorting.
- **Cart & Slide-over Drawer:** Multi-item cart management with dynamic price calculation and vendor-based item grouping.
- **Multi-Gateway Checkout:** Seamless checkout using **Stripe** credit cards, **PayPal**, or **Cash on Delivery (COD)**.
- **Order Tracking & History:** Detailed order status tracking (`Processing`, `Shipping`, `Delivered`, `Refunded`).
- **Product Reviews & Ratings:** Star ratings and comment reviews for purchased items.
- **Buyer-Seller Live Chat:** Real-time WebSocket messaging with vendors directly from the product or order page.

### 🏪 Seller (Vendor) Portal
- **Dedicated Store Setup:** Custom store registration, avatar/logo uploads, and store description.
- **Product & Inventory Management:** Add, edit, catalog, and remove products with multi-image support (Cloudinary).
- **Timed Flash Events:** Host timed promotional discount events with start and end timers.
- **Coupon Code Generator:** Create custom promotional codes with minimum order thresholds.
- **Order Logistics & Refunds:** Manage incoming store orders, transition shipping statuses, and process buyer refund requests.
- **Financial Balances & Payouts:** Track store earnings, view sales analytics, and submit payout withdrawal requests.

### 🛡️ Admin Dashboard
- **Marketplace Overview:** Real-time analytics on platform revenue, total users, vendors, and orders.
- **User & Seller Management:** Inspect, manage, and verify buyer and shop accounts.
- **Withdrawal Approvals:** Review payout requests submitted by sellers and update transaction statuses.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Build:** React 18.3, Vite 7.2
- **State Management:** Redux Toolkit 2.8, React-Redux, Redux-Thunk
- **Routing:** React Router v7.8
- **Styling & UI:** TailwindCSS v4, Material-UI (MUI Material v7 & MUI DataGrid), React Icons
- **HTTP Client:** Axios (v1.11)
- **Payment SDKs:** `@stripe/react-stripe-js`, `@paypal/react-paypal-js`

### Backend
- **Runtime & Framework:** Node.js, Express.js (v5.1)
- **Database ODM:** MongoDB Atlas via Mongoose (v8.17)
- **Security & Auth:** JSONWebToken (JWT), BcryptJS, Cookie-Parser, CORS
- **Media Uploads:** Multer (memory buffer) + Cloudinary CDN (v2.9)
- **Email Service:** Nodemailer (SMTP)

### Real-Time Gateway
- **WebSockets:** Socket.io (v4.8) for live messaging, online presence, and read receipts.

---

## 📐 System Architecture

```
                                +-----------------------+
                                |  React 18 Frontend    |
                                |  (Vite + Redux + MUI) |
                                +-----------+-----------+
                                            |
                    +-----------------------+-----------------------+
                    | HTTPS REST API                                | WebSockets
                    v                                               v
        +-----------------------+                       +-----------------------+
        | Express 5 API Server  |                       | Socket.io Server      |
        +-----------+-----------+                       +-----------+-----------+
                    |                                               |
       +------------+------------+------------+                     |
       |                         |            |                     |
       v                         v            v                     v
+--------------+          +------------+ +----------+    +----------------------+
| MongoDB Atlas|          | Cloudinary | | Stripe/  |    | Live Messaging &     |
| Database     |          | CDN Media  | | PayPal   |    | Online Presence      |
+--------------+          +------------+ +----------+    +----------------------+
```

---

## 📁 Project Structure

```
multivender/
├── backend/
│   ├── config/             # Database connection & env setup
│   ├── controller/         # API Route Handlers (user, shop, product, order, event, etc.)
│   ├── db/                 # MongoDB database initializer
│   ├── middleware/         # Auth, Role Guard (isSeller, isAdmin), ErrorHandler
│   ├── model/              # Mongoose Schemas (User, Shop, Product, Event, Order, etc.)
│   ├── utils/              # JWT Token Generator, Send Mail, Cloudinary config
│   ├── app.js              # Express app setup & route binding
│   ├── server.js           # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # Reusable UI Components (Header, Cart, ProductCard, etc.)
│   │   ├── pages/          # Application Pages (Home, Shop, Admin, Checkout, Inbox)
│   │   ├── redux/          # Redux Toolkit Slices & Thunk Actions
│   │   ├── routes/         # Protected Route wrappers
│   │   ├── styles/         # Global styles & Tailwind entry
│   │   ├── App.jsx         # App router configuration
│   │   └── main.jsx        # React DOM entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── socket/                 # Standalone Socket.io Gateway Server
│   ├── index.js            # Real-time WebSocket connection handling
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.x or later)
- MongoDB Atlas cluster URI or local MongoDB instance
- Cloudinary account credentials
- Stripe & PayPal developer accounts

### 1. Clone the Repository
```bash
git clone https://github.com/TaniaRajpoot/multivender.git
cd multivender
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

#### Socket Server
```bash
cd ../socket
npm install
```

---

## 🔑 Environment Variables

### Backend (`backend/config/.env`)
```env
PORT=8000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/multivender?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES=7d
ACTIVATION_SECRET=your_activation_secret_key
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_SERVICE=gmail
SMPT_MAIL=your_email@gmail.com
SMPT_PASSWORD=your_email_app_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_API_KEY=pk_test_...
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_SERVER_URL=http://localhost:8000/api/v2
VITE_SOCKET_SERVER=http://localhost:4000
```

### Socket Server (`socket/.env`)
```env
PORT=4000
```

---

## 🏃 Running locally

Start backend API server, socket gateway, and frontend dev server in 3 separate terminal windows:

```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Socket Server
cd socket
node index.js

# Terminal 3: Frontend Dev Server
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser to view the application.

---

## ⚡ API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v2/user/create-user` | Register new user & send activation mail | No |
| `POST` | `/api/v2/user/activation` | Verify account activation token | No |
| `POST` | `/api/v2/user/login-user` | Authenticate user & issue HttpOnly cookie | No |
| `POST` | `/api/v2/shop/create-shop` | Register a new seller shop storefront | No |
| `POST` | `/api/v2/product/create-product` | Add a new product to shop catalog | Yes (Seller) |
| `GET`  | `/api/v2/product/get-all-products` | Fetch all active marketplace products | No |
| `POST` | `/api/v2/event/create-event` | Add a time-bound promotional event | Yes (Seller) |
| `POST` | `/api/v2/order/create-order` | Process new checkout order | Yes (User) |
| `POST` | `/api/v2/payment/process` | Create Stripe PaymentIntent | Yes (User) |
| `POST` | `/api/v2/withdraw/create-withdraw-request` | Submit earnings payout request | Yes (Seller) |

---

## 💬 Real-Time Messaging Gateway

The dedicated `socket` server manages bidirectional real-time events for instant communication:

- `addUser`: Maps `userId` to active WebSocket connection ID.
- `sendMessage`: Forwards live message payloads directly to receiver's socket ID.
- `messageSeen`: Updates read status flags asynchronously.
- `updateLastMessage`: Syncs conversation list snippets across buyer and vendor inboxes.

---

## 📄 License

This project is licensed under the **ISC License**.

---

⭐ **Star this repository if you find it helpful!**  
Developed with ❤️ by [Tania Rajpoot](https://github.com/TaniaRajpoot)
