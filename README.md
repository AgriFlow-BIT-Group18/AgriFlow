# AgriFlow Ecosystem 🌿

AgriFlow is a modern, integrated digital ecosystem designed to streamline the distribution of agricultural inputs (seeds, fertilizers) in Burkina Faso. It connects farmers, distributors, and administrators through a unified platform to ensure transparency, efficiency, and real-time tracking of agricultural resources.

## 🏗️ System Architecture

The ecosystem consists of three main components:

1.  **[AgriFlow Web Dashboard](./fids)**: A Next.js-based administrative interface for distributors and system administrators to manage inventory, users, and analyze distribution trends.
2.  **[AgriFlow Backend](./AgriFlow_backend)**: A robust Node.js/Express API that powers the entire ecosystem, handling data persistence, authentication, and complex analytics.
3.  **[AgriFlow Mobile](./AgriFlow_mobile)**: A Flutter-based mobile application designed for farmers to browse products, place orders, and track deliveries.

---

## 🛠️ Technology Stack

### Frontend (Web)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, Role-Based Access Control (RBAC)
- **Documentation**: Swagger/OpenAPI

### Mobile (Farmer App)
- **Framework**: Flutter
- **Language**: Dart
- **Storage**: Shared Preferences
- **Architecture**: Modular Services/Screens

---

## 🔄 System Data Flow & Integration

The AgriFlow ecosystem is designed for seamless data synchronization across all platforms:

1.  **Centralized Backend**: The Node.js/Express API (connected to MongoDB) acts as the single source of truth for all resource, order, and user data.
2.  **Web Dashboard (Administrative)**: Connects to the Backend via REST API to manage the catalog, audit orders, and view global analytics. It also integrates directly with **Groq AI** for administrative assistance.
3.  **Mobile App (Operational)**: Connects to the same Backend API to allow farmers to place orders and track deliveries. It also uses **Groq AI** for localized agricultural support.
4.  **Security Layer**: All communication between Frontend/Mobile and Backend is secured using **JWT (JSON Web Tokens)**.

### 📅 Order Lifecycle Flow
1.  **Initiation**: A Farmer places an order via the **Mobile App**.
2.  **Processing**: The **Backend** validates the stock and records the pending order.
3.  **Audit**: A Distributor or Admin reviews and approves the order via the **Web Dashboard**.
4.  **Logistics**: A Delivery is scheduled on the **Web Dashboard**, which becomes visible to the Farmer on the **Mobile App** for real-time tracking.

---

## 🚀 Key Features

- **Role-Based Access Control**: Granular permissions for Admins, Distributors, and Farmers.
- **Real-Time Analytics**: Dashboard for auditing distributions and regional performance in Burkina Faso.
- **Inventory Management**: Full lifecycle tracking of agricultural inputs.
- **Order & Delivery Tracking**: End-to-end tracking from request to delivery confirmation.
- **AI-Powered Assistance**: Integrated AI specialists (Neural, Analytics, Logistics, Inventory) to support users.

---

## 📦 Repositories

- **Main Ecosystem**: [https://github.com/AgriFlow-BIT-Group18/AgriFlow](https://github.com/AgriFlow-BIT-Group18/AgriFlow)
- **Backend API**: [https://github.com/AgriFlow-BIT-Group18/AgriFlow_backend](https://github.com/AgriFlow-BIT-Group18/AgriFlow_backend)
- **Mobile App**: [https://github.com/AgriFlow-BIT-Group18/AgriFlow_mobile](https://github.com/AgriFlow-BIT-Group18/AgriFlow_mobile)

---

## 📄 License

© 2026 AgriFlow Ecosystem. All rights reserved.
