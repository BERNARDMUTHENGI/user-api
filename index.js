const express = require("express");

const app = express();
app.use(express.json());

// In-memory storage
const users = [];

// Home route
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    message: "Simple User API is running",
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
        body: {
          name: "string",
          email: "string",
        },
      },
    ],
  });
});

// GET all users
app.get("/users", (req, res) => {
  res.json(users);
});

// POST a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  const user = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(user);

  res.status(201).json({
    message: "User added successfully",
    user,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});