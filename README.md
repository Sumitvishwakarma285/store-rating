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

**Live Demo**: [Store Rating Platform](#)  
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
