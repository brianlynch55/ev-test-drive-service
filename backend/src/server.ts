import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/database";
import testDriveRoutes from "./routes/testDriveRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Main routes
app.use("/api/test-drive", testDriveRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await disconnectDB();
    console.log("MongoDB disconnected");
    process.exit(0);
  });
});

export default app;