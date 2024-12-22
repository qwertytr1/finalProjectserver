require("dotenv").config();
const express = require("express");
const sequelize = require("../src/config/database");
const apiRoutes = require("../src/routes/api");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require('../src/middleware/error-middleware.js');
const app = express();

// Updated CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow cookies
}));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

// Error Middleware
app.use(errorMiddleware);

// Sync DB and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.error("Failed to sync database:", err));