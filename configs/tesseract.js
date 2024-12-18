//const Tesseract = require("tesseract.js");
import Tesseract from "tesseract.js";

const ImageReader = async (filePath) => {
  try {
    const result = await Tesseract.recognize(
      filePath, // Caminho da imagem
      "por" // Idioma
    );
    return result.data.text; // Retorna o texto reconhecido
  } catch (error) {
    console.error("Erro ao reconhecer a imagem:", error);
    throw error; // Opcional, para propagar o erro
  }
};

export { ImageReader };
