import { pool } from "../configs/db.js";

const createTables = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(10) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        user_chat TEXT NOT NULL,
        osvaldo_chat TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;

    await pool.query(query);
  } catch (error) {
    console.error("Erro ao criar tabela:", error);
  } finally {
    pool.end();
  }
};

export { createTables };
