const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a real database)
let users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@equitytax1.com',
    password: 'password',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@equitytax1.com',
    password: 'password',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + user.id
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Validate password
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + newUser.id
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  const userId = token.replace('mock-jwt-token-', '');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: { user: userWithoutPassword }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    users: users.length
  });
});

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Registered users: ${users.length}`);
});
