import { pool } from "../configs/db.js";

const InsertUser = async (id, name, email) => {
  try {
    const query = `
        INSERT INTO users (id, name, email)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const values = [id, name, email];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
  }
};

const InsertChat = async (userId, subject, userChat, osvaldoChat) => {
  try {
    const query = `
      INSERT INTO chats (user_id, subject, user_chat, osvaldo_chat)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, subject, userChat, osvaldoChat];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Erro ao inserir chat:", error);
  }
};

const DeleteChat = async (userId, subject) => {
  try {
    const query = `
      DELETE FROM chats
      WHERE user_id = $1 and subject = $2
      RETURNING *;
    `;
    const values = [userId, subject];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Erro ao excluir chat:", error);
  }
};

const ConsultChat = async (userId, subject) => {
  try {
    const query = `
    SELECT user_chat, osvaldo_chat FROM chats
    WHERE user_id = $1 AND subject = $2
    `;

    const values = [userId, subject];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null; // Retorna null se nenhum resultado for encontrado
    }

    return result.rows[0];
  } catch (error) {
    console.error("Erro ao consultar chat", error);
  }
};

export { InsertUser, InsertChat, DeleteChat, ConsultChat };
