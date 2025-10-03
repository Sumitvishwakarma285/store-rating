# Store Rating Platform  

<p align="center">  
    <strong>A comprehensive MERN stack application for rating and managing stores</strong>  
</p>  

<p align="center">  
    <img src="https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react" />  
    <img src="https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js" />  
    <img src="https://img.shields.io/badge/Express-4.18.2-lightgrey?style=flat-square&logo=express" />  
    <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql" />  
    <img src="https://img.shields.io/badge/Deployed-Render-success?style=flat-square&logo=render" />  
</p>  

---

## 📋 Table of Contents  

- [Overview](#-overview)  
- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Project Structure](#-project-structure)  
- [Installation & Setup](#-installation--setup)  
- [Environment Variables](#-environment-variables)  
- [API Endpoints](#-api-endpoints)  
- [Deployment](#-deployment)  
- [User Roles & Permissions](#-user-roles--permissions)  
- [Screenshots](#-screenshots)  
- [Contributing](#-contributing)  
- [License](#-license)  

---

## 🎯 Overview  

The **Store Rating Platform** is a full-stack web application built with the **MERN stack** that allows users to discover, rate, and review stores.  

The platform implements **role-based authentication** with three distinct user types:  
- Normal Users  
- Store Owners  
- Administrators  

**Live Demo**: [Store Rating Platform](https://store-rating-4.onrender.com/)  
**API Docs**: [Backend API](#)  

---

## ✨ Features  

### 🔐 Authentication & Authorization  
- Unified login system (all roles)  
- Role-based access control  
- JWT authentication & protected routes  
- Self-registration (for normal users only)  

### 👥 User Management (Admin Only)  
- CRUD operations on users  
- Assign roles (user, store_owner, admin)  
- Bulk operations + search/filter  

### 🏪 Store Management  
- **Admins**: Full CRUD on stores  
- **Store Owners**: Manage owned stores  
- **Users**: Browse & review stores  

### ⭐ Rating System  
- 1–5 star ratings  
- One rating per store (updatable)  
- Real-time updates  
- Rating analytics  

### 📊 Dashboards  
- **Admin**: system stats & analytics  
- **Store Owner**: store performance  
- **User**: personal ratings history  

### 🎨 UI/UX  
- Responsive (Tailwind CSS)  
- Toast notifications  
- Loading states + error handling  

---

## 🛠 Tech Stack  

**Frontend**  
- React 18.2  
- React Router DOM  
- Tailwind CSS  
- Axios  
- React Hook Form  
- React Toastify  
- Heroicons  

**Backend**  
- Node.js 18.x  
- Express.js  
- JWT, Bcrypt  
- CORS, Helmet  

**Database**  
- MySQL 8.0 (Aiven Cloud)  
- Connection pooling  
- Foreign key constraints  

**Deployment**  
- Render (Frontend + Backend)  

---

## 📁 Project Structure  

```bash
store-rating/
├── backend/                 # Express.js API server
│   ├── config/              # DB config
│   ├── controllers/         # Request handlers
│   ├── middleware/          # JWT + validation
│   ├── models/              # DB models
│   ├── routes/              # API routes
│   ├── .env                 
│   ├── package.json
│   └── server.js
├── frontend/                # React client
│   ├── public/
│   ├── src/
│   │   ├── components/  
│   │   ├── context/     
│   │   ├── pages/       
│   │   ├── utils/       
│   │   ├── App.jsx     
│   │   └── index.js     
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
├── README.md
└── package.json             # Root
```

---

## 🚀 Installation & Setup  

### Prerequisites  
- Node.js 18+  
- MySQL 8+  
- Git  

### Steps  

1. **Clone Repository**  
     ```bash
     git clone https://github.com/yourusername/store-rating-platform.git
     cd store-rating-platform
     ```

2. **Backend Setup**  
     ```bash
     cd backend
     npm install
     cp .env.example .env   # add your DB + JWT configs
     npm run init-db        # initialize database
     npm run dev            # start dev server
     ```

3. **Frontend Setup**  
     ```bash
     cd frontend
     npm install
     cp .env.example .env   # add API URL
     npm start
     ```

4. **Access**  
     - Frontend → `http://localhost:3000`  
     - Backend API → `http://localhost:5000`  
     - Health Check → `http://localhost:5000/api/health`  

---

## 🔧 Environment Variables  

### Backend (`.env`)  
```env
NODE_ENV=development
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_platform
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env`)  
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Store Rating Platform
```

---

## 📚 API Endpoints  

### Authentication  
- `POST /api/auth/login` – Login  
- `POST /api/auth/register` – Register (users only)  
- `GET /api/auth/verify` – Verify token  

### Users (Admin Only)  
- `GET /api/users` – Get all users  
- `POST /api/users` – Create user  
- `PUT /api/users/:id` – Update user  
- `DELETE /api/users/:id` – Delete user  
- `GET /api/users/dashboard-stats` – Stats  

### Stores  
- `GET /api/stores` – All stores  
- `POST /api/stores` – Create (admin)  
- `GET /api/stores/:id` – Store details  
- `PUT /api/stores/:id` – Update (admin)  
- `DELETE /api/stores/:id` – Delete (admin)  

### Ratings  
- `POST /api/ratings` – Add/update rating  
- `GET /api/ratings/user` – User ratings  
- `GET /api/ratings/store/:storeId` – Store ratings  

---

## 🌐 Deployment  

Deployed on Render with separate services:  
- **Frontend** → Live URL  
- **Backend** → API URL  

---

## 👤 User Roles & Permissions  

### 🔵 Normal User  
- ✅ Self-register  
- ✅ Browse/search stores  
- ✅ Rate stores  
- ✅ Profile + dashboard  

### 🟡 Store Owner  
- ❌ Registration via Admin  
- ✅ Manage owned stores  
- ✅ Dashboard for ratings  

### 🔴 Admin  
- ✅ Manage users & roles  
- ✅ Full CRUD on stores  
- ✅ Platform-wide analytics  

---

<p align="center">  
    <strong>⭐ Star this repo if you found it helpful! ⭐</strong>  
</p>  

<p align="center">  
    Made with ❤️ using the MERN Stack  
</p>  