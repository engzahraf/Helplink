# 🚀 START HERE - HelpLink Backend Setup

Welcome! Your HelpLink backend is ready to use. Follow these steps to get it running in **5 minutes**.

---

## ⚡ 5-Minute Quick Start

### 1. Prerequisites
```bash
# Check Node.js (need v14+)
node --version

# Ensure MySQL is running
mysql --version
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env - Update MySQL password and JWT secret
nano .env  # or open with your editor
```

### 4. Initialize Database
```bash
node database/init.js
```

You should see:
```
✓ Database 'helplink_db' ready
✓ Database schema created/updated
✓ Admin account created
```

### 5. Start Backend
```bash
npm run dev
```

You should see:
```
✓ Database connected successfully
✓ HelpLink Backend Server running on http://localhost:5000
```

**✅ Done! Your backend is running!**

---

## 📋 Next: Test It Works

### Quick Test with curl
```bash
# Test if server is running
curl http://localhost:5000/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"administrative","password":"123@123"}'
```

### Comprehensive Testing with Postman
1. Open Postman
2. Click **Import**
3. Select `postman_collection.json`
4. Test all endpoints!

---

## 📚 Documentation

### Quick References
- **QUICKSTART.md** - Detailed 5-minute setup
- **README.md** - Complete API documentation (400+ lines)
- **PROJECT_SUMMARY.md** - Overview of what was built
- **DEVELOPMENT_GUIDE.md** - How to modify code
- **FILE_REFERENCE.md** - Where each file is and what it does

### Recommended Reading Order
1. **This file** (you're reading it!)
2. **QUICKSTART.md** (if you need step-by-step)
3. **README.md** (for API reference)
4. **DEVELOPMENT_GUIDE.md** (to modify code)

---

## 🎯 What You Have

✅ **14 API Endpoints** - All fully functional
- 2 Authentication endpoints
- 3 User management endpoints
- 5 Support request endpoints
- 4 Notification endpoints

✅ **Complete Database**
- 3 MySQL tables
- Foreign key relationships
- Automatic initialization

✅ **Security**
- JWT authentication
- bcrypt password hashing
- Role-based access control

✅ **Documentation**
- 5 comprehensive guides
- Postman collection
- Code comments

---

## 🔐 Default Admin Credentials

```
Username: administrative
Password: 123@123
```

⚠️ **Change this after first login!**

---

## 🚨 Troubleshooting

### Database Connection Failed?
```
✗ Check that MySQL is running
✗ Check credentials in .env file
✗ Make sure database exists
```

### Port 5000 Already in Use?
```
✗ Change PORT in .env file (try 5001)
✗ Or kill the process on that port
```

### Need Help?
See **README.md** for full troubleshooting section.

---

## 📂 Key Files

| File | What It Does |
|------|--------------|
| `server.js` | Main application |
| `package.json` | Dependencies |
| `.env` | Configuration (copy from `.env.example`) |
| `database/init.js` | Initialize MySQL database |
| `postman_collection.json` | Test all endpoints |

---

## 🧪 Test Endpoints

### 1. Check Server Status
```bash
curl http://localhost:5000/health
```

### 2. Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

Copy the `token` from response, then:

### 4. Get Your Profile
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 Development Workflow

### Make Code Changes
1. Edit files in `controllers/`, `routes/`, etc.
2. Server automatically restarts (nodemon)
3. Test with Postman

### Add New Endpoint
1. Create controller function
2. Add route in `routes/`
3. Server restarts automatically
4. Test with Postman

See **DEVELOPMENT_GUIDE.md** for detailed examples.

---

## 📱 Frontend Connection

Frontend should send requests to:
```
http://localhost:5000/api/*
```

Example in frontend code:
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: 'admin', password: 'pass' })
});
const data = await response.json();
const token = data.token;
```

---

## ✨ You're All Set!

Your HelpLink backend is:
- ✅ Fully functional
- ✅ Well documented
- ✅ Ready for production
- ✅ Easy to extend

### Next Steps

1. **Test it**: Use Postman to test all endpoints
2. **Connect frontend**: Point frontend to http://localhost:5000
3. **Develop**: Add features as needed
4. **Deploy**: Move to production when ready

---

## 💡 Common Questions

**Q: Where do I change the port?**
A: Edit `PORT=5000` in `.env` file

**Q: How do I change the database password?**
A: Edit `DB_PASSWORD` in `.env` file

**Q: How long do tokens last?**
A: 7 days by default (edit `expiresIn` in controllers if needed)

**Q: Can I add more user roles?**
A: Yes! Edit `database/schema.sql` and update ENUM values

**Q: How do I test locally?**
A: Import `postman_collection.json` into Postman

---

## 📞 Need More Help?

- **Setup Issues**: See **QUICKSTART.md**
- **API Documentation**: See **README.md**
- **Code Changes**: See **DEVELOPMENT_GUIDE.md**
- **File Details**: See **FILE_REFERENCE.md**
- **Overview**: See **PROJECT_SUMMARY.md**

---

## 🎉 Everything is Ready!

Your complete HelpLink backend is set up and ready to go. 

**Start by running:**
```bash
npm run dev
```

Then test endpoints with Postman.

Good luck! 🚀

---

**Last Updated:** October 2026  
**Status:** ✅ Complete & Ready to Use
