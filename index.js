const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage
let users = [];
let nextId = 1;

// GET /users - Retrieve all users
app.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// POST /users - Create a new user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required fields'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    age: age || null,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// Optional: GET /users/:id - Get single user
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Optional: DELETE /users/:id - Delete a user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  users.splice(userIndex, 1);
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'User API is running',
    endpoints: {
      GET: '/users - Get all users',
      POST: '/users - Create a new user',
      GET: '/users/:id - Get user by ID',
      DELETE: '/users/:id - Delete user by ID'
    }
  });
});

// Start server (only when not running on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;