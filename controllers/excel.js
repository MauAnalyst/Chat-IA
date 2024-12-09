import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ReadTab = async (name, file) => {
  const filePath = path.join(__dirname, `../${file}.xlsx`);

  try {
    const workbook = XLSX.readFile(filePath); // Lê o arquivo Excel
    const worksheet = workbook.Sheets[name]; // Seleciona a aba pelo nome
    if (!worksheet) throw new Error(`Aba "${name}" não encontrada.`);
    const data = XLSX.utils.sheet_to_json(worksheet); // Converte para JSON
    return data;
  } catch (error) {
    console.error("Erro ao ler a aba:", error.message);
    return null;
  }
};

const addConversation = async (user, subject, message, osvaldo, file) => {
  const filePath = path.join(__dirname, `../${file}.xlsx`);
  try {
    // Verifica se o arquivo já existe
    let workbook;
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath); // Lê o arquivo existente
    } else {
      workbook = XLSX.utils.book_new(); // Cria um novo arquivo Excel
    }

    // Seleciona a aba ou cria uma nova
    const sheetName = user;
    let worksheet = workbook.Sheets[sheetName];
    let data = worksheet
      ? XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      : []; // Dados existentes

    // Adiciona o cabeçalho se a aba está vazia
    //   if (data.length === 0) {
    //     data.push(["Assunto", "Usuario", "Osvaldo"]); // Cabeçalho
    //   }

    // Adiciona a nova conversa como uma nova linha
    data.push([subject, message, osvaldo]);

    // Converte os dados de volta para uma aba
    worksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets[sheetName] = worksheet;

    // Garante que a aba está no workbook
    if (!workbook.SheetNames.includes(sheetName)) {
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Salva o arquivo Excel
    XLSX.writeFile(workbook, filePath);
  } catch (error) {
    console.error("Erro ao adicionar conversa:", error.message);
  }
};

export { ReadTab, addConversation };
