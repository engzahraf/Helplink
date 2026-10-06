# HelpLink Backend - Development Guide

Complete guide for understanding, modifying, and extending the HelpLink backend.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [How Things Work](#how-things-work)
4. [Adding New Features](#adding-new-features)
5. [Code Examples](#code-examples)
6. [Best Practices](#best-practices)
7. [Debugging](#debugging)

---

## 🏗️ Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│      http://localhost:5173          │
└──────────────┬──────────────────────┘
               │ REST API Calls
               ↓
┌─────────────────────────────────────┐
│       Backend (Express.js)          │
│      http://localhost:5000          │
│                                     │
│  Routes → Controllers → Models      │
└──────────────┬──────────────────────┘
               │ SQL Queries
               ↓
┌─────────────────────────────────────┐
│        Database (MySQL)             │
│       helplink_db                   │
└─────────────────────────────────────┘
```

### Request Flow

```
Frontend Request
       ↓
Express Middleware (CORS, JSON parsing)
       ↓
Route Handler
       ↓
Middleware (Authentication, Authorization)
       ↓
Controller (Business Logic)
       ↓
Database Query
       ↓
Response to Frontend
```

---

## 📁 Folder Structure

```
backend/
│
├── config/
│   └── database.js
│       └── Database connection pool configuration
│           - Manages MySQL connections
│           - Connection pooling for performance
│
├── middleware/
│   └── auth.js
│       ├── authenticate() - Verifies JWT tokens
│       └── authorize() - Checks user role permissions
│
├── controllers/
│   ├── authController.js - Login & Registration
│   ├── userController.js - Profile management
│   ├── supportRequestController.js - Request operations
│   └── notificationController.js - Notification handling
│       └── Business logic for each feature
│           - Input validation
│           - Database operations
│           - Response formatting
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── supportRequestRoutes.js
│   └── notificationRoutes.js
│       └── Define API endpoints
│           - Map URLs to controllers
│           - Apply middleware
│
├── database/
│   ├── schema.sql - MySQL table definitions
│   ├── init.js - Database initialization script
│   └── seed.js - Admin account creation
│
├── utils/
│   └── validators.js
│       └── Input validation functions
│           - Email format validation
│           - Password strength validation
│
├── server.js - Main Express app
├── package.json - Dependencies
├── .env.example - Environment template
├── .gitignore - Git exclusions
└── README.md - Documentation
```

---

## 🔄 How Things Work

### 1. Database Connection

**File:** `config/database.js`

```javascript
// Creates a connection pool (not single connection)
const pool = mysql.createPool({...});

// Why pool? 
// - Handles multiple concurrent requests
// - Better performance
// - Automatic connection management
```

**Usage in Controllers:**
```javascript
const connection = await pool.getConnection();
const [rows] = await connection.query(sql, params);
connection.release(); // Return to pool
```

### 2. Authentication Flow

**File:** `middleware/auth.js`

```
1. Frontend sends request with token:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

2. Middleware extracts token

3. Verifies token using JWT_SECRET

4. Extracts user info (id, email, role)

5. Attaches to request.user

6. Passes to controller
```

**Token Contents (JWT Payload):**
```javascript
{
  id: 1,
  email: "john@example.com",
  role: "student",
  iat: 1705310400,  // Issued at
  exp: 1705915200   // Expires at (7 days)
}
```

### 3. Authorization (Role-Based Access)

**File:** `middleware/auth.js`

```javascript
// In routes:
router.post('/', authorize('student'), createRequest);

// Flow:
1. Request passes authenticate middleware
2. Then passes authorize('student')
3. If user.role !== 'student' → 403 Forbidden
4. If user.role === 'student' → proceed
```

### 4. Request Processing

**Example: Create Support Request**

```javascript
// 1. ROUTE (routes/supportRequestRoutes.js)
router.post('/', authorize('student'), createRequest);

// 2. MIDDLEWARE
//    authenticate() ← verifies JWT
//    authorize('student') ← checks role

// 3. CONTROLLER (controllers/supportRequestController.js)
async function createRequest(req, res) {
  // req.user is available (set by middleware)
  const { title, description, category } = req.body;
  
  // Validate inputs
  if (!title || !description) {
    return res.status(400).json({...});
  }
  
  // Database operation
  const [result] = await connection.query(
    'INSERT INTO support_requests (student_id, title, ...) VALUES (...)',
    [req.user.id, title, ...]
  );
  
  // Send response
  res.status(201).json({
    success: true,
    request: {...}
  });
}

// 4. DATABASE
//    INSERT query executes
//    Returns result

// 5. RESPONSE
//    JSON sent back to frontend
```

---

## ✨ Adding New Features

### Scenario: Add "Assign Staff" Feature

Staff members should be able to be assigned to support requests.

#### Step 1: Database Changes

**File:** `database/schema.sql`

```sql
-- Add staff role to users
ALTER TABLE users MODIFY role ENUM('student', 'admin', 'staff');

-- Add assigned_staff_id to requests
ALTER TABLE support_requests ADD COLUMN assigned_staff_id INT;
ALTER TABLE support_requests ADD FOREIGN KEY (assigned_staff_id) 
  REFERENCES users(id) ON DELETE SET NULL;
```

Run: `node database/init.js` (updates schema)

#### Step 2: Create Controller Method

**File:** `controllers/supportRequestController.js`

```javascript
const assignStaff = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { requestId, staffId } = req.body;
    
    // Only admins can assign staff
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can assign staff'
      });
    }
    
    // Verify staff exists and is staff role
    const [staffUsers] = await connection.query(
      'SELECT id FROM users WHERE id = ? AND role = ?',
      [staffId, 'staff']
    );
    
    if (staffUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    // Update request
    await connection.query(
      'UPDATE support_requests SET assigned_staff_id = ? WHERE id = ?',
      [staffId, requestId]
    );
    
    // Create notification for staff
    await connection.query(
      'INSERT INTO notifications (user_id, request_id, message) VALUES (?, ?, ?)',
      [staffId, requestId, 'You have been assigned to a support request']
    );
    
    res.status(200).json({
      success: true,
      message: 'Staff assigned successfully'
    });
    
  } catch (error) {
    console.error('Assign staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign staff'
    });
  } finally {
    connection.release();
  }
};
```

#### Step 3: Export Function

**File:** `controllers/supportRequestController.js` (end of file)

```javascript
module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  assignStaff  // ← Add this
};
```

#### Step 4: Add Route

**File:** `routes/supportRequestRoutes.js`

```javascript
const { authenticate, authorize } = require('../middleware/auth');
const { ..., assignStaff } = require('../controllers/supportRequestController');

// POST /api/support-requests/:id/assign
router.post('/:id/assign', authorize('admin'), assignStaff);
```

#### Step 5: Update Middleware

**File:** `middleware/auth.js` - No changes needed!

The role-based authorization already works with new roles.

#### Step 6: Test in Postman

```http
POST http://localhost:5000/api/support-requests/1/assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "requestId": 1,
  "staffId": 3
}
```

---

## 💻 Code Examples

### Adding Validation

```javascript
// utils/validators.js
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone);
};

const validateSemester = (semester) => {
  const validSemesters = ['Fall', 'Spring', 'Summer'];
  return validSemesters.includes(semester);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,      // ← Add new
  validateSemester    // ← Add new
};
```

### Adding Error Handling

```javascript
// controllers/userController.js
const getProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Try to get user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: users[0]
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    
    // Different error types
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        success: false,
        message: 'Database schema error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
    
  } finally {
    connection.release();
  }
};
```

### Query with Pagination

```javascript
const { page = 1, limit = 10 } = req.query;

const offset = (page - 1) * limit;

// Get data
const [requests] = await connection.query(
  'SELECT * FROM support_requests ORDER BY created_at DESC LIMIT ? OFFSET ?',
  [parseInt(limit), offset]
);

// Get total count
const [countResult] = await connection.query(
  'SELECT COUNT(*) as total FROM support_requests'
);

const total = countResult[0].total;

res.json({
  success: true,
  requests,
  pagination: {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / limit)
  }
});
```

### Async Operations in Parallel

```javascript
// Execute multiple queries at the same time
const [users, requests, notifications] = await Promise.all([
  connection.query('SELECT * FROM users WHERE id = ?', [userId]),
  connection.query('SELECT * FROM support_requests WHERE student_id = ?', [userId]),
  connection.query('SELECT * FROM notifications WHERE user_id = ?', [userId])
]);
```

---

## 📋 Best Practices

### 1. Always Use Prepared Statements

```javascript
// ✅ CORRECT - Prevents SQL injection
const [users] = await connection.query(
  'SELECT * FROM users WHERE email = ?',
  [userEmail]
);

// ❌ WRONG - SQL injection vulnerable
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### 2. Validate Input

```javascript
// ✅ CORRECT - Check before using
if (!name || name.trim().length === 0) {
  return res.status(400).json({...});
}

// ❌ WRONG - No validation
const query = `UPDATE users SET name = ? WHERE id = ?`;
```

### 3. Release Connections

```javascript
// ✅ CORRECT - Always release in finally
try {
  const connection = await pool.getConnection();
  // Do something
} finally {
  connection.release(); // ← Important!
}

// ❌ WRONG - Connection leak
const connection = await pool.getConnection();
const result = await connection.query(...);
res.json(result); // Connection never released!
```

### 4. Hash Passwords

```javascript
// ✅ CORRECT
const hashedPassword = await bcrypt.hash(password, 10);
// Store hashedPassword

// ❌ WRONG - Never store plain text
await connection.query(
  'INSERT INTO users (password) VALUES (?)',
  [password] // ← Never do this!
);
```

### 5. Use Meaningful Variable Names

```javascript
// ✅ CORRECT
const requestId = req.params.id;
const studentEmail = user.email;
const adminResponse = req.body.response;

// ❌ WRONG
const id = req.params.id;
const e = user.email;
const resp = req.body.response;
```

### 6. Log Errors

```javascript
// ✅ CORRECT
catch (error) {
  console.error('Create request error:', error);
  res.status(500).json({...});
}

// ❌ WRONG
catch (error) {
  res.status(500).json({...});
  // Silent failure - hard to debug
}
```

---

## 🐛 Debugging

### 1. Check Server Logs

```bash
# Development mode shows all logs
npm run dev

# Look for:
# - "Database connected successfully"
# - "Server running on..."
# - Any error messages
```

### 2. Use Console.log

```javascript
const createRequest = async (req, res) => {
  console.log('Creating request...');
  console.log('User:', req.user);
  console.log('Body:', req.body);
  
  // Your code
};
```

### 3. Check Network Tab (Frontend)

```javascript
// Frontend network tab shows:
// - Request URL
// - Request headers
// - Request body
// - Response status
// - Response body
```

### 4. Test with Postman

```
1. Set authorization header
2. Send request
3. Check Status Code
4. Check Response Body
5. Copy token if needed
```

### 5. Check Database Directly

```bash
# Login to MySQL
mysql -u root -p helplink_db

# Check tables
SHOW TABLES;

# Check data
SELECT * FROM users;
SELECT * FROM support_requests;

# Check specific user
SELECT * FROM users WHERE email = 'john@example.com';
```

### 6. Common Errors

**Error: Database connection failed**
```
→ Check MySQL is running
→ Check DB credentials in .env
→ Check database exists
```

**Error: JWT token expired**
```
→ User needs to login again
→ Frontend should handle this
→ Redirect to login page
```

**Error: 403 Forbidden**
```
→ User doesn't have required role
→ Check authorize() middleware
→ Admin endpoints need admin token
```

**Error: 404 Not Found**
```
→ Route doesn't exist
→ Check spelling in URL
→ Check route is registered
```

---

## 🚀 Next Steps

1. **Understand the flow** - Read through one complete request
2. **Add a test route** - Create a simple GET endpoint
3. **Modify a controller** - Add logging, change response
4. **Add validation** - Add a new validator function
5. **Create a feature** - Follow the scenario above

---

**Happy developing! 🎉**
