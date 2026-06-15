# 🚀 Guia de Inicialização do Projeto

Para rodar o projeto é necessário seguir os seguintes passos:

## 1. Clonar o Repositório
Faça o clone do projeto para a sua máquina.

## 2. Configurar e Iniciar o Frontend
Abra primeiro a pasta frontend na IDE e siga o caminho até o arquivo api.ts:

```bash
/frontend/src/services/api.ts
```

Ao abrir o arquivo, vá até a linha 4 e insira o IPv4 do computador que irá rodar o projeto:

```bash
const API_URL = 'http://SEU_IPv4:3000';
```

Salve as alterações no arquivo, e abra seu terminal para executar os seguintes comandos:

```bash
cd frontend
npm i
npx expo start
```

## 3. Configurar e Iniciar o Backend
Após isso, abra a pasta backend na IDE e abra o arquivo app.js no caminho:

```bash
/backend/app.js
```

Ao abrir o arquivo, vá até a linha 11 e insira o IPv4 do computador que irá rodar o projeto:

```bash
const IP_LINK = process.env.IP_LINK || 'SEU_IP_AQUI'
```

Salve as alterações no arquivo, e abra seu terminal para executar os seguintes comandos:

```bash
cd backend
npm i
npm start
```
