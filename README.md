# Sales API

This is a sample Sales Management API built with **Fastify**, **MongoDB**, and **Mongoose**.  
It manages **Customers**, **Products**, and **Sales** with authentication, role-based authorization, and monthly sales reporting.

---

## Installation & Setup

### 1. **Clone the repository**
Open your terminal or command prompt and run:

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. **Install dependencies**
```bash
npm i
```

### 3. **Configure environment variables**
The API requires a MongoDB connection and a port number.

#### 3.1 Copy the sample environment file
```bash
cp .env_bak .env
```

#### 3.2 Edit `.env` with your own values, or use the sample MongoDB connection string:
```env
PORT=5000
MONGODB_STRING="mongodb+srv://admin:admin123@cluster0.ytx67ow.mongodb.net/sales-api?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="your-secret-key"
```

### Notes
- Make sure MongoDB is running or accessible via the connection string.  
- Keep your `JWT_SECRET` safe for authentication.  
- After setup, you can start the server with:

```bash
npm start
```

---

## Features
- **Customer Management:** CRUD operations for customers  
- **Product Management:** CRUD operations for products  
- **Sales Management:** Create and view sales, generate monthly reports  
- **Authentication & Authorization:** JWT-based login and role-based access  

---

## Technologies
- **Fastify** – High-performance Node.js framework  
- **MongoDB** – NoSQL database  
- **Mongoose** – MongoDB object modeling  
- **JWT** – JSON Web Tokens for authentication

---

## 💡 Usage
1. Start the server:

```bash
npm start
```

2. Use an API client like **Postman** to test endpoints.  

3. Endpoints are structured as:
- `/api/v1/customers` – Manage customers  
- `/api/v1/products` – Manage products  
- `/api/v1/sales` – Manage sales and reports