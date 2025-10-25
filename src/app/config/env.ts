import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_RESRESH_EXPIRES: string;
  NODE_ENV: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_PORT: string;
    SMTP_HOST: string;
    SMTP_FROM: string;
  };
  GOOGLE_MAPS_API_KEY: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_RESRESH_EXPIRES",
    "NODE_ENV",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_HOST",
    "SMTP_FROM",
    "GOOGLE_MAPS_API_KEY"
  ];

  requiredEnvVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
      throw new Error(`${envVariable} is required`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_RESRESH_EXPIRES: process.env.JWT_RESRESH_EXPIRES as string,
    NODE_ENV: process.env.NODE_ENV as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
     EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY as string
  };
};

export const envVars = loadEnvVariables();
