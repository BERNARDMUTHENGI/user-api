const express = require("express");

const app = express();
app.use(express.json());

// In-memory data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: 3,
    name: "Bernard Muthengi",
    email: "bernard@example.com",
  },
];

// Home route
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    message: "Simple User API is running",
    description:
      "A basic REST API built with Express.js that stores user data in memory.",
    endpoints: [
      {
        method: "GET",
        url: `${baseUrl}/users`,
        description: "Retrieve all users",
      },
      {
        method: "POST",
        url: `${baseUrl}/users`,
        description: "Add a new user",
        sampleRequest: {
          name: "Alice Johnson",
          email: "alice@example.com",
        },
      },
    ],
    sampleUsersCount: users.length,
  });
});

// GET all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// POST a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User added successfully",
    user: newUser,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});