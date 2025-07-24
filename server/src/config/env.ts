import dotenv from "dotenv";
dotenv.config();

interface IEnv {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
}

const env: IEnv = {
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export { env };
