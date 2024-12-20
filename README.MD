# Osvaldo IA

Osvaldo IA é um sistema de chatbot inteligente desenvolvido com a API do Gemini, da Google, para centralizar a base de conhecimentos de uma empresa (Empresa X).

O principal objetivo do projeto é facilitar o suporte interno e externo, organizando os processos e sub-processos da empresa em um formato acessível.

### Funcionalidades

- **Centralização de Conhecimentos:**  
  A IA utiliza um arquivo `base.xlsx` como sumário da base de conhecimento. Para informações mais detalhadas, os sub-processos relacionados são armazenados em arquivos `.txt` na pasta `conhecimentos`, acessados conforme a necessidade das perguntas.

- **OCR para Textos em Imagens:**  
  Integração com a biblioteca `tesseract.js` para extrair textos de imagens enviadas.

- **Upload de Arquivos:**  
  Suporte ao envio de arquivos com a biblioteca `multer`.

- **Autenticação Segura:**  
  Implementado com Auth0 para login e gerenciamento de usuários.

- **Armazenamento de Conversas:**  
  Conversas são salvas em um banco de dados PostgreSQL gerenciado pelo NeonDB.

### Tecnologias Utilizadas

- **Back-end:**
  - Node.js com Express
- **Front-end:**
  - HTML, CSS e JavaScript puro
- **IA:**
  - API Gemini do Google
- **Autenticação:**
  - Auth0
- **Banco de Dados:**
  - NeonDB (PostgreSQL)
- **Outras Bibliotecas:**
  - `multer`: para upload de imagens
  - `tesseract.js`: para OCR (reconhecimento óptico de caracteres)

### Configuração do Ambiente

1. Clone este repositório:

   ```bash
   git clone https://github.com/usuario/Osvaldo-IA.git
   cd Osvaldo-IA

   ```

2. Instale as dependências:

   ```bash
   npm install

   ```

3. Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

   ```bash
   GEMINI_API_KEY=<sua-chave-da-api-gemini>
   DATABASE_URL=<url-do-banco-de-dados>
   AUTH0_CLIENT_SECRET=<seu-client-secret-auth0>
   AUTH0_BASE_URL=<url-do-seu-projeto>
   AUTH0_CLIENT_ID=<seu-client-id-auth0>
   AUTH0_DOMAIN=<seu-dominio-auth0>
   ```

4. Execute o projeto
   ```bash
   npm start ou node server.js
   ```
