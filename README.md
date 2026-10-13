# 🌾 FarmConnect — Local Farmer-to-Customer Marketplace

> **“Fresh from Local Farms, Directly to You.”**  
> Direct farmer-to-consumer agricultural marketplace eliminating predatory middlemen, ensuring fair remuneration for local growers, and delivering fresh harvests directly to conscious consumers.

---

## 🚀 Key Highlights & Hackathon Features

1. **Full MERN Stack Implementation**:
   - **Frontend**: React 19, Vite, Tailwind CSS, Lucide icons, React Router, Recharts.
   - **Backend**: Node.js, Express.js REST API.
   - **Database**: MongoDB with Mongoose document models (featuring dual-mode execution with an integrated fail-safe in-memory store for instant demonstration).
   - **Authentication**: JWT tokens, bcrypt password hashing, role-based authorization (Customer, Farmer, Admin).
   - **Maps**: Interactive Leaflet & OpenStreetMap GIS coordinates for farm discovery and farm location picking.

2. **Core Functionalities**:
   - **Customer Marketplace**: Browse by category (Vegetables, Fruits, Grains, Pulses, Dairy, Organic Produce), search query, location/region, price filters, and sorting. Real Indian currency (₹) and agricultural units (`kg`, `dozen`, `litre`, `piece`, `bunch`).
   - **Multi-Farmer Cart & Checkout**: Add crops from different local farms into one consolidated basket. Each farmer manages fulfillment of their respective items. Server calculates authoritative totals and automatically deducts inventory.
   - **Farmer Dashboard**:
     - Live KPI metrics (Revenue, Orders, Products, Low-Stock Warnings &lt; 10 units).
     - Recharts sales area graph computed from actual database orders.
     - Full Crop CRUD (Add new harvest, upload images, set price/quantity, delete).
     - Order fulfillment status progression (`Confirmed` → `Packed` → `Shipped` → `Delivered`, with inventory auto-restoration upon cancellation).
     - Interactive Leaflet farm coordinate picker.
   - **Customer Dashboard**:
     - 5-step visual order fulfillment progress timeline.
     - Order history with itemized price breakdown.
     - Delivery address and profile management.
   - **Admin HQ Console**:
     - Platform Gross Merchandise Value (GMV), user distribution, and order status charts.
     - User account governance (one-click activate/deactivate).
     - Listing moderation (toggle visible/delist).
     - Sample seed reset button for instant evaluation.
   - **1-Click Test Accounts for Judges**:
     - 👨‍🌾 **Farmer**: Ramesh Patil (`ramesh.farmer@farmconnect.org` / `password123`)
     - 🛒 **Customer**: Priya Sharma (`customer@farmconnect.org` / `password123`)
     - 🛡️ **Admin**: FarmConnect HQ (`admin@farmconnect.org` / `password123`)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend UI | React.js (Vite), Tailwind CSS |
| Routing | React Router DOM |
| Maps | Leaflet + OpenStreetMap tiles |
| Analytics Charts | Recharts |
| Backend Server | Node.js & Express.js |
| Data Layer | MongoDB & Mongoose + Integrated Fail-Safe Engine |
| Security | Bcrypt.js, JSON Web Tokens (JWT) |

---

## 📦 Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Server Port
PORT=3000

# JWT Signing Secret
JWT_SECRET="your-super-secret-jwt-key-farmconnect-hackathon"

# MongoDB Connection String (Optional for local eval; seamlessly uses integrated store if empty)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/farmconnect?retryWrites=true&w=majority"
```

---

## 🏃 Quick Start Guide for Judges & Evaluators

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register customer or farmer account (public admin registration forbidden).
- `POST /api/auth/login` — Login with email and password, receives JWT token.
- `GET /api/auth/me` — Retrieve authenticated user profile.
- `PUT /api/auth/profile` — Update address, phone, or farm details.

### Products (`/api/products`)
- `GET /api/products` — Query catalog with filters (`category`, `search`, `minPrice`, `maxPrice`, `city`, `sort`, `page`).
- `GET /api/products/:id` — Retrieve product details with farmer info.
- `POST /api/products` — Farmer: Add new product (validates price $\ge 0$ and quantity $\ge 0$).
- `PUT /api/products/:id` — Farmer/Admin: Update product.
- `DELETE /api/products/:id` — Farmer/Admin: Remove listing.

### Farmers Directory (`/api/farmers`)
- `GET /api/farmers` — List verified local growers with GPS coordinates and available stock.
- `GET /api/farmers/:id` — Single farmer profile.
- `GET /api/farmers/:id/products` — In-stock produce by farmer.

### Orders (`/api/orders`)
- `POST /api/orders` — Customer checkout: Validates stock on server, calculates subtotal, deducts inventory atomically, saves order.
- `GET /api/orders/my` — Customer gets their orders; Farmer gets orders with their items.
- `GET /api/orders/:id` — Single order details.
- `PATCH /api/orders/:id/status` — Update item fulfillment status (`Confirmed`, `Packed`, `Shipped`, `Delivered`, `Cancelled`).

### Analytics & Admin (`/api/analytics`, `/api/admin`)
- `GET /api/analytics/farmer` — Farmer KPIs, low stock alerts, Recharts sales series.
- `GET /api/analytics/admin` — Admin platform GMV, category breakdown, status distribution.
- `GET /api/admin/users` — List platform users.
- `PATCH /api/admin/users/:id/toggle-status` — Deactivate/activate user.
- `GET /api/admin/products` — Moderation catalog.
- `PATCH /api/admin/products/:id/toggle-status` — Delist/relist product.
- `POST /api/admin/reset-seed` — Reset test data to clean state.
- `GET /api/admin/demo-credentials` — Quick demo account credentials.
