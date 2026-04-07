# Fullstack eCommerce App (Updated Version)

This project is a complete fullstack ecommerce example using the latest technologies.

## Technology Stack
- **Backend**: Express + TypeScript + Prisma + MongoDB (Online/Local)
- **Frontend**: React + Vite + TailwindCSS
- **Database**: MongoDB (Atlas or Local with Replica Set)

## Root Structure
- `backend/`: Express Server & Prisma ORM
- `frontend/`: React UI with Modern Aesthetics

## Getting Started

### 1. Database Setup (MongoDB)
This project requires MongoDB with a **Replica Set** enabled (automatic on Atlas).
- Create a Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Whitelist your IP in **Network Access**.
- Get your connection string (`mongodb+srv://...`).

### 2. Backend Setup
1.  **Configure Env**:
    Create `backend/.env` with your MongoDB URL:
    ```env
    PORT=4000
    DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@CLUSTER/DB_NAME?retryWrites=true&w=majority"
    JWT_SECRET="your-secret-key"
    FRONTEND_ORIGIN="*"
    ```
2.  **Install & Generate**:
    ```bash
    cd backend
    npm install
    npx prisma generate
    npx prisma db push
    ```
3.  **Seed Data**:
    Populate the database using `backend/data.json`:
    ```bash
    npm run prisma:seed
    ```
4.  **Run Server**:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  **Install**:
    ```bash
    cd frontend
    npm install
    ```
2.  **Run UI**:
    ```bash
    npm run dev
    ```

## Features Implemented
- **MongoDB Integration**: Switched from SQLite to MongoDB for scalability.
- **Admin Category CRUD**: Full management of categories (Create, Read, Update, Delete) in the Admin Dashboard with inline editing.
- **Default Image**: Products without images automatically display a default fallback (`IPHONE4.jpeg`).
- **Data Import**: Dynamic seeding from `data.json`.
- **Cart & Orders**: Full shopping experience for authenticated users.

## Access Details
- **Admin**: `admin@example.com` / `Admin123!`
- **Client**: `client@example.com` / `Client123!`

---
*Backend: http://localhost:4000* | *Frontend: http://localhost:5173*
