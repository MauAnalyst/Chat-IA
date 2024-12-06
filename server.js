import express from "express";
import dotenv from "dotenv";
import open from "open";

dotenv.config();
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Servidor está rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  //open(`http://localhost:${PORT}`);
});
