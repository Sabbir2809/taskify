import cors from "cors";
import express from "express";
import env from "./config/env";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import router from "./routes";

const app = express();

// ========================
// Middleware
// ========================
app.use(
  cors({
    origin: env.frontendUrl ?? "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// Routes
// ========================
app.use("/api/v1", router);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "🚀 Taskify Server is Up and Running!",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// global error handler
app.use(globalErrorHandler);
// 404 handler
app.use(notFoundHandler);

export default app;
