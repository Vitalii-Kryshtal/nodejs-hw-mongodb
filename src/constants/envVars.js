import path from "node:path";
export const CLOUDINARY = {
  CLOUDINARY_NAME: "CLOUDINARY_NAME",
  CLOUDINARY_API_KEY: "CLOUDINARY_API_KEY",
  CLOUDINARY_API_SECRET: "CLOUDINARY_API_SECRET",
  ENABLE_CLOUDINARY: "ENABLE_CLOUDINARY",
};
export const ENV_VARS = {
  PORT: "PORT",
  MONGO_DB_USER: "MONGO_DB_USER",
  MONGO_DB_PASSWORD: "MONGO_DB_PASSWORD",
  MONGO_DB_HOST: "MONGO_DB_HOST",
  MONGO_DB_DB: "MONGO_DB_DB",
  APP_DOMAIN: "APP_DOMAIN",
  JWT_SECRET: "JWT_SECRET",
  BACKEND_DOMAIN: "BACKEND_DOMAIN",
};

export const SMTP = {
  SMTP_HOST: "SMTP_HOST",
  SMTP_PORT: "SMTP_PORT",
  SMTP_USER: "SMTP_USER",
  SMTP_PASSWORD: "SMTP_PASSWORD",
  SMTP_FROM: "SMTP_FROM",
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), "temp");
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const TEMPLATE_DIR_PATH = path.join(process.cwd(), "src", "templates");
export const SWAGGER_PATH = path.join(process.cwd(), "docs", "swagger.json");
