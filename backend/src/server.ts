import app from "./app";
import env from "./config/env";

const startServer = async (): Promise<void> => {
  // Start the server
  const server = app.listen(env.port, () => {
    console.log(`🔧 Environment: ${env.nodeEnv}`);
    console.log(`🚀 Server running on http://localhost:${env.port}`);
  });

  // Graceful shutdown function
  const shutdown = async (signal: string): Promise<void> => {
    console.info(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.info("✅ Server shut down cleanly.");
      process.exit(0);
    });
  };

  // Listen for termination signals
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason) => {
    console.error("🔥 Unhandled Rejection:", reason);
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error("🔥 Uncaught Exception:", error.message);
    process.exit(1);
  });
};

startServer();
