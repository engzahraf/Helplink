# HelpLink Backend - Complete File Reference

## 📋 All Files Created

### Documentation Files (Start Here!)
```
QUICKSTART.md                 - 5-minute setup guide (READ FIRST)
README.md                     - Complete documentation with API examples (400+ lines)
DEVELOPMENT_GUIDE.md          - For modifying and extending code
PROJECT_SUMMARY.md            - Overview of what was built
FILE_REFERENCE.md             - This file
```

### Configuration Files
```
package.json                  - Node.js dependencies & scripts
.env.example                  - Environment variables template (COPY TO .env)
.gitignore                    - Git exclusions (don't commit .env!)
```

### Core Application
```
server.js                     - Main Express application setup
```

### Configuration Module
```
config/
  └── database.js             - MySQL connection pool configuration
```

### Security Middleware
```
middleware/
  └── auth.js                 - JWT authentication & role-based authorization
```

### Business Logic Controllers
```
controllers/
  ├── authController.js       - User registration & login
  ├── userController.js       - Profile management & password changes
  ├── supportRequestController.js - CRUD for support requests
  └── notificationController.js   - Notification management
```

### API Routes
```
routes/
  ├── authRoutes.js           - POST /api/auth/register, /api/auth/login
  ├── userRoutes.js           - GET/PUT /api/users/profile, change-password
  ├── supportRequestRoutes.js - CRUD /api/support-requests/*
  └── notificationRoutes.js   - GET/PUT /api/notifications/*
```

### Database
```
database/
  ├── schema.sql              - CREATE TABLE statements for MySQL
  ├── init.js                 - Run this to initialize database
  └── seed.js                 - Creates admin account
```

### Utilities
```
utils/
  └── validators.js           - Input validation functions
```

### Testing
```
postman_collection.json       - Import into Postman for API testing
```

---

## 🎯 What Each File Does

### Entry Point
**server.js** (30 lines)
- Creates Express app
- Configures middleware (CORS, JSON parsing)
- Registers routes
- Starts server on port 5000

### Configuration
**config/database.js** (25 lines)
- Creates MySQL connection pool
- Tests connection on startup
- Provides connection interface to controllers

### Authentication
**middleware/auth.js** (50 lines)
- `authenticate()` - Verifies JWT tokens
- `authorize()` - Checks user role (student/admin)
- Extracts user info and attaches to request

### Business Logic (Controllers)

**controllers/authController.js** (130 lines)
- `register()` - Creates new student account
- `login()` - Authenticates user and returns JWT

**controllers/userController.js** (180 lines)
- `getProfile()` - Returns user profile
- `updateProfile()` - Updates name/email
- `changePassword()` - Changes password with verification

**controllers/supportRequestController.js** (320 lines)
- `createRequest()` - Student creates support request
- `getRequests()` - List requests (role-aware)
- `getRequestById()` - Get specific request
- `updateRequest()` - Update by student/admin
- `deleteRequest()` - Delete pending request

**controllers/notificationController.js** (140 lines)
- `getNotifications()` - List user notifications
- `markAsRead()` - Mark single notification
- `markAllAsRead()` - Mark all as read
- `getUnreadCount()` - Get unread count

### Routes (API Endpoints)

**routes/authRoutes.js** (20 lines)
```
POST /api/auth/register
POST /api/auth/login
```

**routes/userRoutes.js** (30 lines)
```
GET  /api/users/profile
PUT  /api/users/profile
PUT  /api/users/change-password
```

**routes/supportRequestRoutes.js** (40 lines)
```
POST   /api/support-requests
GET    /api/support-requests
GET    /api/support-requests/:id
PUT    /api/support-requests/:id
DELETE /api/support-requests/:id
```

**routes/notificationRoutes.js** (35 lines)
```
GET /api/notifications
GET /api/notifications/unread-count
PUT /api/notifications/read-all
PUT /api/notifications/:id/read
```

### Database

**database/schema.sql** (60 lines)
- Creates `users` table
- Creates `support_requests` table
- Creates `notifications` table
- Defines relationships with foreign keys
- Adds indexes for performance

**database/init.js** (80 lines)
- Connects to MySQL
- Creates database if needed
- Runs schema.sql
- Creates admin account

**database/seed.js** (50 lines)
- Alternative way to create admin account
- Can be run separately if needed

### Utilities

**utils/validators.js** (15 lines)
- `validateEmail()` - Checks email format
- `validatePassword()` - Checks password length

---

## 📊 Lines of Code

```
Total Project: ~1,500 lines

Core Application:
  server.js                      30 lines
  middleware/auth.js             50 lines
  config/database.js             25 lines
                                --------
  Total Core:                   105 lines

Controllers:
  authController.js             130 lines
  userController.js             180 lines
  supportRequestController.js   320 lines
  notificationController.js     140 lines
                                --------
  Total Controllers:            770 lines

Routes:
  authRoutes.js                  20 lines
  userRoutes.js                  30 lines
  supportRequestRoutes.js        40 lines
  notificationRoutes.js          35 lines
                                --------
  Total Routes:                 125 lines

Database:
  schema.sql                     60 lines
  init.js                        80 lines
  seed.js                        50 lines
                                --------
  Total Database:               190 lines

Utilities:
  validators.js                  15 lines
                                --------
  Total Utilities:               15 lines

Testing:
  postman_collection.json       280 lines

Documentation:
  README.md                     400+ lines
  DEVELOPMENT_GUIDE.md          300+ lines
  QUICKSTART.md                 120+ lines
  PROJECT_SUMMARY.md            250+ lines
```

---

## 🔄 How Files Connect

```
USER REQUEST
    ↓
server.js (Express app)
    ↓
middleware/auth.js (JWT verification)
    ↓
routes/*.js (Find matching endpoint)
    ↓
controllers/*.js (Business logic)
    ↓
config/database.js (MySQL query)
    ↓
database/schema.sql (Table structure)
    ↓
RESPONSE TO USER
```

---

## 🚀 Getting Started Checklist

### Step 1: Understand Structure
- [ ] Read PROJECT_SUMMARY.md
- [ ] Skim README.md
- [ ] Review this file

### Step 2: Setup
- [ ] Copy .env.example to .env
- [ ] Edit .env with MySQL credentials
- [ ] Run: `npm install`

### Step 3: Initialize
- [ ] Ensure MySQL is running
- [ ] Run: `node database/init.js`
- [ ] Check for "✓ Database initialization complete"

### Step 4: Run Server
- [ ] Run: `npm run dev`
- [ ] Check for "✓ HelpLink Backend Server running"

### Step 5: Test
- [ ] Import postman_collection.json into Postman
- [ ] Test login endpoint
- [ ] Copy token to {{token}} variable
- [ ] Test other endpoints

### Step 6: Develop
- [ ] Read DEVELOPMENT_GUIDE.md for how to modify
- [ ] Make changes to controllers/routes
- [ ] Restart server to see changes
- [ ] Test with Postman

---

## 📝 File Dependencies

### server.js needs:
- package.json (dependencies)
- routes/*.js (imports all routes)
- config/database.js (imports connection)

### routes/*.js need:
- controllers/*.js (imports handlers)
- middleware/auth.js (imports auth functions)

### controllers/*.js need:
- config/database.js (imports connection)
- utils/validators.js (imports validators)

### config/database.js needs:
- .env (database credentials)

### database/init.js needs:
- database/schema.sql (SQL statements)

---

## 🎯 Which File to Edit For...

| Goal | File | Function |
|------|------|----------|
| Add new API endpoint | routes/*.js | Add route |
| Change endpoint behavior | controllers/*.js | Modify controller |
| Add data to response | controllers/*.js | Modify response |
| Change database table structure | database/schema.sql | Modify CREATE TABLE |
| Add validation | utils/validators.js | Add validator function |
| Change authentication | middleware/auth.js | Modify authenticate() |
| Change authorization | middleware/auth.js | Modify authorize() |
| Add required field to table | database/schema.sql | Add column |
| Change error messages | controllers/*.js | Update res.json() |
| Add new role (e.g., 'staff') | database/schema.sql | Modify ENUM |

---

## 🔐 Important Security Files

**middleware/auth.js**
- JWT token verification
- Role-based authorization
- Most critical for security

**controllers/authController.js**
- Password hashing with bcrypt
- Login validation
- Session token generation

**utils/validators.js**
- Input validation
- Prevents invalid data in database

---

## 🧪 Testing Files

**postman_collection.json**
- All API endpoints
- Example requests/responses
- Ready to import into Postman

---

## 📚 Documentation Files

| File | Purpose | Read When |
|------|---------|-----------|
| QUICKSTART.md | Get running fast | First time setup |
| README.md | Complete API docs | Need API reference |
| DEVELOPMENT_GUIDE.md | Code examples | Want to modify code |
| PROJECT_SUMMARY.md | Overview | Want summary |
| FILE_REFERENCE.md | This file | Need file details |

---

## ✨ Quick File Lookup

Need to...

**Add a new endpoint?**
1. Create function in controllers/
2. Export from controllers/
3. Add route in routes/
4. Import route in server.js

**Add a database column?**
1. Modify database/schema.sql
2. Run: `node database/init.js`
3. Update controller query

**Change password hashing?**
1. Edit controllers/authController.js
2. Look for bcrypt.hash()

**Change JWT expiration?**
1. Edit controllers/authController.js
2. Look for jwt.sign() and { expiresIn: '7d' }

**Add new validation?**
1. Add function to utils/validators.js
2. Use in controllers/

**Change database connection?**
1. Edit config/database.js
2. Update .env credentials

**Change API response format?**
1. Edit controllers/
2. Look for res.json() responses

---

## 🎓 Recommended Reading Order

1. **PROJECT_SUMMARY.md** - Understand what was built
2. **QUICKSTART.md** - Get it running
3. **README.md** - Learn all endpoints
4. **DEVELOPMENT_GUIDE.md** - See code examples
5. **This file** - Reference file locations

---

**All files ready to use! Start with QUICKSTART.md 🚀**
