# HelpLink Backend - Quick Start Guide

Get the HelpLink backend running in **5 minutes**!

## ⚡ Quick Setup

### 1. Prerequisites Check
```bash
# Check Node.js
node --version  # Should be v14+

# Check npm
npm --version

# Ensure MySQL is running
mysql --version
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your MySQL credentials
nano .env  # or open with your editor
```

Edit the following in `.env`:
```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=generate_a_random_string_here
```

### 4. Initialize Database
```bash
node database/init.js
```

You should see:
```
🔧 Initializing HelpLink Database...
✓ Database 'helplink_db' ready
✓ Database schema created/updated
✓ Admin account created

  Credentials:
    Username: administrative
    Password: 123@123
```

### 5. Start Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

Success! You should see:
```
✓ Database connected successfully
✓ HelpLink Backend Server running on http://localhost:5000
✓ Frontend CORS origin: http://localhost:5173
✓ Environment: development
```

---

## 🧪 Test It Works

### Option A: Using Postman
1. Import `postman_collection.json` into Postman
2. Test endpoints in the collection
3. Copy token from login response into `{{token}}` variable

### Option B: Using curl

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"administrative","password":"123@123"}'
```

Copy the token from response, then:

**Get Profile:**
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Next Steps

1. **Connect Frontend**: Frontend should send requests to `http://localhost:5000`
2. **Test Workflows**: Use Postman to test all endpoints
3. **Database**: Check `helplink_db` with MySQL client
4. **Logging**: Monitor console for errors
5. **Security**: Change admin password after first login

---

## 📖 Full Documentation

See `README.md` for:
- Complete API endpoints
- Database schema details
- Authentication flow
- Troubleshooting
- Project structure

---

## 🚨 Common Issues

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
→ Make sure MySQL is running: `mysql -u root -p`

### Port 5000 Already in Use
```
Error: listen EADDRINUSE :::5000
```
→ Change `PORT=5001` in `.env`

### Dependencies Missing
```
Error: Cannot find module 'express'
```
→ Run: `npm install`

---

## ✅ You're Ready!

Your HelpLink backend is now running and ready to accept requests from the frontend.

**Default Admin Credentials:**
- Username: `administrative`
- Password: `123@123`

⚠️ **Change this after first login!**

---

## 📞 Need Help?

Check the README.md for detailed documentation, API examples, and troubleshooting.

Happy coding! 🚀
