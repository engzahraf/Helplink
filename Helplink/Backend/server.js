const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Mock authentication logic
  // In a real application, you would check these credentials against a database
  if (email === 'admin@helplink.com' && password === 'password123') {
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: 1,
        email: email,
        name: 'Admin User'
      }
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
