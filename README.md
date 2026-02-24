# Sales API

This is a sample Sales Management API built with **Fastify**, **MongoDB**, and **Mongoose**.  
It manages **Customers**, **Products**, and **Sales** with authentication, role-based authorization, and monthly sales reporting.

---

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd <repo-folder>

2. **Install dependencies**
```bash
npm i

3. **Configure environment variables**
The API requires a MongoDB connection and a port number.
3.1 Copy the sample environment file:
```bash
cp .env_bak .env
3.2 Edit .env with your own values, or you can use the sample MongoDB connection string below:
```env
PORT=5000
MONGODB_STRING="mongodb+srv://admin:admin123@cluster0.ytx67ow.mongodb.net/sales-api?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="your-secret-key"
