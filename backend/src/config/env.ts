import "dotenv/config";

const env = {
  // Server Configuration
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  // Database Configuration
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDb: process.env.POSTGRES_DB,
  databaseUrl:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}?schema=public`,
  // Authentication
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  // Cors
  frontendUrl: process.env.FRONTEND_URL,
};

export default env;
