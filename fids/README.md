# AgriFlow Web Dashboard (FIDS) 🖥️

The **Frontend Interface for Distribution Systems (FIDS)** is the administrative command center of the AgriFlow ecosystem. It provides system administrators and distributors with powerful tools to manage, audit, and analyze agricultural resource distribution.

## 🚀 Key Features

- **Executive Dashboard**: Real-time overview of active orders, deliveries, and top-performing products.
- **Inventory Management**: Comprehensive CRUD interface for managing agricultural inputs.
- **Order Audit System**: Workflow for reviewing, approving, or rejecting farmer orders.
- **Delivery Orchestration**: Tools to schedule deliveries, assign drivers, and track progress.
- **Advanced analytics**: Interactive reports with regional performance tracking (Burkina Faso), volume trends, and export capabilities.
- **User Management**: Centralized hub for managing staff and farmer accounts with activity tracking.
- **AI-Powered Sidekick**: Integrated, multi-model AI assistant for immediate logistics and inventory support.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Fetching**: Axios
- **State Management**: React Context & Hooks

---

## 🔄 API Integration & Architecture

### 📡 Backend Connection
The dashboard connects to the AgriFlow Backend API using **Axios**.
- **Base URL**: Configured via `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000/api`).
- **Authentication**: A custom Axios interceptor (in `src/services/api.ts`) automatically attaches the **JWT Bearer Token** from `localStorage` to every outgoing request.

### 🤖 AI Sidekick (Groq Integration)
The AI assistant (Neural, Analytics, Logistics, Inventory) communicates directly with the **Groq Cloud API**:
- **Models**: Uses `llama-3.1-8b-instant` for text and `meta-llama/llama-4-scout-17b-16e-instruct` for vision-based tasks.
- **Capabilities**: Multilingual support, image analysis for warehouse/logistics photos, and real-time data insights.

---

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
    - `(dashboard)/`: Protected dashboard routes (Orders, Deliveries, Inventory, etc.).
    - `login/`: Authentication interface.
- `src/components/`:
    - `layout/`: Global components (Sidebar, Header, DashboardLayout).
    - `ui/`: Reusable, atomic UI components (Badge, Table, Modal).
- `src/services/`: API abstractions and service layers for orders, users, and analytics.
- `src/lib/`: Utility functions and shared helpers.

## 🔑 Permissions (RBAC)

- **Admin**: Full read/write access to all sections.
- **Distributor**: Professional read access. Can audit all systems, view reports, and track deliveries, but is restricted from modifying core inventory or user data.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    - Build a `.env` file pointing to your Backend URL.
3.  **Run Development Environment**:
    ```bash
    npm run dev
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 📄 License

© 2026 AgriFlow Ecosystem. All rights reserved.
