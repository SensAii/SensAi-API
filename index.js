import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Connection Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test Database Connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow frontend URL
    credentials: true, // Allow sending cookies
  })
);
app.use(cookieParser()); // **Must be before route handlers**

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "FocusLearn API", version: "1.0.0" },
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sessions", sessionRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
