import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; // Extrai Pool do pacote

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexão segura
  },
});

export { pool };
