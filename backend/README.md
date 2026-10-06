# HelpLink Backend - Student Support Management System

Backend API for the HelpLink Student Support Management System built with Node.js, Express, and MySQL.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Testing with Postman](#testing-with-postman)

---

## 🎯 Project Overview

HelpLink is a web-based student support management system that enables:

- **Students** to submit and track support requests
- **Administrators** to view, manage, and respond to requests
- **Real-time notifications** for status updates

The backend provides RESTful APIs for:
- User authentication (registration & login)
- Profile management
- Support request management
- Notification tracking

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv
- **CORS**: For cross-origin requests
- **API Testing**: Postman

---

## ✅ Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v14 or higher)
   - [Download Node.js](https://nodejs.org/)

2. **MySQL** (v5.7 or higher)
   - [Download MySQL](https://www.mysql.com/downloads/)
   - MySQL running and accessible

3. **Git** (for version control)
   - [Download Git](https://git-scm.com/)

4. **Postman** (optional, for API testing)
   - [Download Postman](https://www.postman.com/downloads/)

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/HelpLink.git
cd HelpLink/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `mysql2` - MySQL driver
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `nodemon` - Development server (auto-restart)

---

## 🗄️ Database Setup

### Step 1: Create `.env` File

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=helplink_db
JWT_SECRET=your_strong_random_secret_key_here
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Step 2: Initialize Database

Run the initialization script to create tables and seed admin account:

```bash
node database/init.js
```

**Output:**
```
🔧 Initializing HelpLink Database...

✓ Database 'helplink_db' ready
✓ Database schema created/updated
✓ Admin account created

  Credentials:
    Username: administrative
    Password: 123@123

✓ Database initialization complete!
```

### Database Structure

#### Users Table
```sql
- id (Primary Key)
- username (unique for admin)
- name
- email (unique)
- password (bcrypt hash)
- role ('student' or 'admin')
- created_at
- updated_at
```

#### Support Requests Table
```sql
- id (Primary Key)
- student_id (Foreign Key → users.id)
- title
- description
- category (Academic, Technical, Administrative, Financial, Accommodation, Other)
- priority (Low, Medium, High)
- status (Pending, In Progress, Resolved, Rejected)
- admin_response
- created_at
- updated_at
```

#### Notifications Table
```sql
- id (Primary Key)
- user_id (Foreign Key → users.id)
- request_id (Foreign Key → support_requests.id)
- message
- is_read (boolean)
- created_at
```

---

## 🔐 Environment Variables

**Required variables** (in `.env`):

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `127.0.0.1` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `helplink_db` |
| `JWT_SECRET` | JWT signing secret | `strong_random_key_123` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment | `development` |

**Security Notes:**
- ✅ Never commit `.env` to GitHub
- ✅ Use strong, random `JWT_SECRET`
- ✅ Keep database password secure
- ✅ Use `.env.example` for placeholders only

---

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

**Expected Output:**
```
✓ Database connected successfully

✓ HelpLink Backend Server running on http://localhost:5000
✓ Frontend CORS origin: http://localhost:5173
✓ Environment: development
```

---

## 📡 API Endpoints

### Health Check
```
GET /health
Response: { "success": true, "message": "HelpLink backend is running" }
```

### Authentication Endpoints

#### Register Student
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "Student account created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": {
    "id": 1,
    "username": null,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Support Request Endpoints

#### Create Support Request
```http
POST /api/support-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Issue with login",
  "description": "Cannot login to system",
  "category": "Technical",
  "priority": "High"
}

Response: 201 Created
{
  "success": true,
  "message": "Support request created successfully",
  "request": {
    "id": 1,
    "title": "Issue with login",
    "description": "Cannot login to system",
    "category": "Technical",
    "priority": "High",
    "status": "Pending"
  }
}
```

#### Get All Requests
```http
GET /api/support-requests
GET /api/support-requests?status=Pending&category=Technical&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "requests": [ ... ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### Get Request Details
```http
GET /api/support-requests/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "request": { ... }
}
```

#### Update Request
```http
PUT /api/support-requests/:id
Authorization: Bearer <token>
Content-Type: application/json

# Students can update: title, description, category, priority (for Pending requests only)
{
  "title": "Updated title",
  "priority": "Medium"
}

# Admins can update: status, admin_response
{
  "status": "In Progress",
  "admin_response": "We are looking into your issue"
}

Response: 200 OK
{
  "success": true,
  "message": "Support request updated successfully",
  "request": { ... }
}
```

#### Delete Request
```http
DELETE /api/support-requests/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Support request deleted successfully"
}
```

### Notification Endpoints

#### Get Notifications
```http
GET /api/notifications
GET /api/notifications?is_read=false&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "notifications": [ ... ],
  "pagination": { ... }
}
```

#### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "All notifications marked as read",
  "affectedRows": 5
}
```

#### Get Unread Count
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "unread_count": 3
}
```

---

## 🔑 Authentication

### How JWT Works

1. **Login**: User provides credentials → Backend generates JWT token
2. **Storage**: Frontend stores token (localStorage/sessionStorage)
3. **Requests**: Frontend sends token in `Authorization` header
4. **Verification**: Backend verifies token before processing request

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Payload

```json
{
  "id": 1,
  "email": "john@example.com",
  "role": "student",
  "iat": 1705310400,
  "exp": 1705915200
}
```

### Expiration

Tokens expire after **7 days**. Users must login again to get a new token.

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js              # Database connection configuration
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── userController.js        # User profile management
│   ├── supportRequestController.js  # Support request operations
│   └── notificationController.js    # Notification management
├── middleware/
│   └── auth.js                  # JWT authentication & authorization
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── userRoutes.js            # User endpoints
│   ├── supportRequestRoutes.js  # Support request endpoints
│   └── notificationRoutes.js    # Notification endpoints
├── database/
│   ├── schema.sql               # Database schema
│   ├── init.js                  # Database initialization
│   └── seed.js                  # Database seeding
├── utils/
│   └── validators.js            # Input validation functions
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🧪 Testing with Postman

### Step 1: Import Collection

1. Open Postman
2. Create new Collection: "HelpLink API"
3. Create folders:
   - Authentication
   - Users
   - Support Requests
   - Notifications

### Step 2: Create Requests

#### Register
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test Student",
  "email": "student@test.com",
  "password": "password123"
}
```

#### Login (Student)
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "identifier": "student@test.com",
  "password": "password123"
}
```

#### Login (Admin)
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "identifier": "administrative",
  "password": "123@123"
}
```

### Step 3: Use Token

Copy the token from login response. Set Authorization header:

1. Click "Authorization" tab
2. Type: Bearer
3. Paste token in Token field

---

## 🔄 Common Workflows

### Student Workflow

1. **Register** → POST `/api/auth/register`
2. **Login** → POST `/api/auth/login` (get token)
3. **View Profile** → GET `/api/users/profile`
4. **Create Request** → POST `/api/support-requests`
5. **View Requests** → GET `/api/support-requests`
6. **View Notifications** → GET `/api/notifications`
7. **Mark Read** → PUT `/api/notifications/:id/read`

### Admin Workflow

1. **Login** → POST `/api/auth/login` (admin credentials)
2. **View All Requests** → GET `/api/support-requests`
3. **View Request** → GET `/api/support-requests/:id`
4. **Update Status** → PUT `/api/support-requests/:id`
5. **View Notifications** → GET `/api/notifications`

---

## 🐛 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Ensure MySQL is running
- Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in `.env` to different value (e.g., 5001)
- Or kill process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

### JWT Token Errors
```
{ "success": false, "message": "Invalid access token" }
```
**Solution:**
- Verify token is included: `Authorization: Bearer <token>`
- Check token format (no extra spaces)
- Token may have expired - login again
- Verify JWT_SECRET in `.env` matches token generation

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify FRONTEND_URL in `.env` matches frontend origin
- Check CORS middleware in `server.js`
- Ensure frontend sends requests to `http://localhost:5000`

---

## 📝 Notes

- **Security**: Never commit `.env` with real credentials
- **Passwords**: Always use bcrypt for hashing
- **Tokens**: Always send in Authorization header
- **Database**: Use foreign keys for relationships
- **Validation**: Validate all user inputs
- **Errors**: Return appropriate HTTP status codes

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review error logs in console
3. Verify `.env` configuration
4. Test endpoints with Postman
5. Check database connection

---

**Happy coding! 🚀**
