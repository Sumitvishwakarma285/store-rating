Store Rating Platform
<p align="center"> <strong>A comprehensive MERN stack application for rating and managing stores</strong> </p> <p align="center"> <img src="https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react" /> <img src="https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js" /> <img src="https://img.shields.io/badge/Express-4.18.2-lightgrey?style=flat-square&logo=express" /> <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql" /> <img src="https://img.shields.io/badge/Deployed-Render-success?style=flat-square&logo=render" /> </p>
📋 Table of Contents
Overview

Features

Tech Stack

Project Structure

Installation & Setup

Environment Variables

API Endpoints

Deployment

User Roles & Permissions

Screenshots

Contributing

License

🎯 Overview
The Store Rating Platform is a full-stack web application built with the MERN stack that allows users to discover, rate, and review stores. The platform implements a role-based authentication system with three distinct user types: normal users, store owners, and administrators.

Live Demo: Store Rating Platform
API Docs: Backend API

✨ Features
🔐 Authentication & Authorization
Unified Login System: Single login for all user roles

Role-Based Access Control: Different dashboards and permissions per role

User Registration: Self-registration available for normal users only

JWT Token Authentication: Secure session management

Protected Routes: Route-level access control

👥 User Management (Admin Only)
Create, read, update, and delete users

Assign roles (normal, store_owner, admin)

Search and filter users

Bulk user operations

🏪 Store Management
For Admins: Full CRUD operations on stores

For Store Owners: View and manage owned stores

For Normal Users: Browse and discover stores

Search and filter functionality

Store details with ratings and reviews

⭐ Rating System
1-5 Star Rating Scale: Intuitive rating system

One Rating Per Store: Users can rate each store once (updatable)

Real-time Rating Updates: Instant feedback on rating changes

Rating Analytics: Average ratings and total review counts

My Ratings Page: Users can view and manage their ratings

📊 Dashboard Features
Admin Dashboard: System overview, user statistics, store analytics

Store Owner Dashboard: Owned stores performance, ratings received

User Dashboard: Personal rating history, quick store access

Real-time Statistics: Live updates on platform metrics

🎨 UI/UX Features
Responsive Design: Mobile-first approach with Tailwind CSS

Interactive Components: Smooth animations and transitions

Toast Notifications: Real-time feedback for user actions

Loading States: Skeleton screens and loading indicators

Error Handling: Comprehensive error pages and validation

🛠 Tech Stack
Frontend
React 18.2.0: User interface library

React Router DOM: Client-side routing

Tailwind CSS: Utility-first CSS framework

Axios: HTTP client for API calls

React Hook Form: Form state management

React Toastify: Toast notifications

Heroicons: Beautiful SVG icons

Backend
Node.js 18.x: JavaScript runtime

Express.js: Web application framework

MySQL 8.0: Relational database

JWT: JSON Web Token authentication

Bcrypt: Password hashing

CORS: Cross-origin resource sharing

Helmet: Security middleware

Database
MySQL: Primary database (Aiven Cloud)

Connection Pooling: Optimized database connections

Foreign Key Constraints: Data integrity enforcement

Deployment
Render: Cloud hosting platform

Separate Deployments: Frontend (Static Site) + Backend (Web Service)

Environment Management: Production-ready configuration

📁 Project Structure
text
store-rating/
├── backend/                 # Express.js API server
│   ├── config/
│   │   └── database.js     # MySQL connection configuration
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── storeController.js
│   │   └── ratingController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── validation.js  # Request validation
│   ├── models/            # Database models and initialization
│   │   └── initDatabase.js
│   ├── routes/            # API route definitions
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── stores.js
│   │   └── ratings.js
│   ├── .env              # Environment variables
│   ├── package.json
│   └── server.js         # Application entry point
├── frontend/              # React.js client application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── Auth/    # Authentication components
│   │   │   ├── Dashboard/ # Role-based dashboards
│   │   │   ├── Store/   # Store management components
│   │   │   └── common/  # Shared components
│   │   ├── context/     # React Context providers
│   │   ├── pages/       # Page-level components
│   │   ├── utils/       # Helper functions & constants
│   │   ├── App.jsx      # Main app component
│   │   └── index.js     # React entry point
│   ├── .env             # Environment variables
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
├── README.md
└── package.json          # Root package.json for deployment
🚀 Installation & Setup
Prerequisites
Node.js 18.x or higher

MySQL 8.0+ database

Git

1. Clone Repository
bash
git clone https://github.com/yourusername/store-rating-platform.git
cd store-rating-platform
2. Backend Setup
bash
cd backend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Initialize database
npm run init-db

# Start development server
npm run dev
3. Frontend Setup
bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
4. Access Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

API Health Check: http://localhost:5000/api/health

🔧 Environment Variables
Backend (.env)
text
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_platform
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000
Frontend (.env)
text
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Store Rating Platform
📚 API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration (normal users only)

GET /api/auth/verify - Verify JWT token

Users (Admin Only)
GET /api/users - Get all users

POST /api/users - Create new user

PUT /api/users/:id - Update user

DELETE /api/users/:id - Delete user

GET /api/users/dashboard-stats - Get dashboard statistics

Stores
GET /api/stores - Get all stores

POST /api/stores - Create store (admin only)

GET /api/stores/:id - Get store details

PUT /api/stores/:id - Update store (admin only)

DELETE /api/stores/:id - Delete store (admin only)

Ratings
POST /api/ratings - Submit/update rating

GET /api/ratings/user - Get user's ratings

GET /api/ratings/store/:storeId - Get store ratings

🌐 Deployment
The application is deployed using Render with separate services:

Production URLs
Frontend: https://store-rating-frontend.onrender.com

Backend: https://store-rating-backend.onrender.com

Deployment Architecture
Frontend: Deployed as Static Site on Render

Backend: Deployed as Web Service on Render

Database: MySQL hosted on Aiven Cloud

Deploy Instructions
Push code to GitHub repository

Create two Render services:

Static Site for frontend (root: frontend/)

Web Service for backend (root: backend/)

Configure environment variables

Deploy both services

For detailed deployment instructions, see the Deployment Guide.

👤 User Roles & Permissions
🔵 Normal User
Registration: ✅ Can self-register

Store Access: ✅ Browse and search stores

Rating: ✅ Rate stores (1-5 stars)

Profile: ✅ View and edit profile

Dashboard: ✅ Personal rating history

🟡 Store Owner
Registration: ❌ Admin-managed only

<p align="center"> <strong>⭐ Star this repo if you found it helpful! ⭐</strong> </p> <p align="center"> Made with ❤️ using the MERN Stack </p>