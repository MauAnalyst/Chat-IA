import mammoth from "mammoth";
import JSZip from "jszip";
import fs from "fs/promises";
import path from "path";

const DocxReader = async (filePath) => {
  try {
    // leitura do texto
    const textResult = await mammoth.extractRawText({ path: filePath });
    const extractedText = textResult.value || "Nenhum texto encontrado.";

    // pegando imagens
    const zipData = await fs.readFile(filePath); // Carrega o arquivo como buffer
    const zip = await JSZip.loadAsync(zipData);

    const imagePromises = [];
    zip.forEach((relativePath, file) => {
      if (relativePath.match(/\.(png|jpeg|jpg)$/i)) {
        imagePromises.push(
          file.async("base64").then((content) => ({
            name: relativePath,
            data: `data:image/${path
              .extname(relativePath)
              .slice(1)};base64,${content}`,
          }))
        );
      }
    });

    const images = await Promise.all(imagePromises);

    return {
      message: "Processamento concluído com sucesso.",
      text: extractedText,
      images: images,
    };
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
  }
};

export { DocxReader };
