# 🚀 Sistema de Gestão de Networking

Este projeto é composto por um **backend em Node.js (Express + Prisma + PostgreSQL)** e um **frontend em Next.js**, com autenticação via **JWT** e estrutura modular para gerenciar **intenções de participação, cadastro de membros e indicações de novos negócios**.

---

## 📦 Instalação e Execução

### ⚙️ Pré-requisitos que devem estar instalados
- Node.js 
- PostgreSQL
- npm

---

## 🛠️ Backend

### 1️⃣ Instalação
```bash
cd api
npm install
```

Para criar o banco PostgreSQL localmente:

```bash
psql -U postgres -c "CREATE DATABASE gestao_networking"
```

### 2️⃣ Configuração do `.env`
Crie um arquivo `.env` na raiz do backend com o conteúdo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestao_networking?schema=public"
JWT_SECRET=jwt_secret_privado
FRONT_PUBLIC_TOKEN=token_api_publico_para_frontend
PRIVATE_TOKEN=token_api_privado_interno
```

### 3️⃣ Banco de Dados
Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

### 4️⃣ Execução Local
```bash
npm run dev
```

> O backend será executado em: **http://localhost:3000**

---

## 💻 Frontend

### 1️⃣ Instalação
```bash
cd web
npm install
```

### 2️⃣ Configuração do `.env.local`
Crie o arquivo `.env.local` na raiz do frontend com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_PUBLIC_TOKEN=token_api_publico_para_frontend
NEXT_PUBLIC_JWT_TOKEN=jwt_token_usuario_logado
```

### 3️⃣ Execução Local
```bash
npm run dev
```

> O frontend será executado em: **http://localhost:4000**

---

## 🌐 Páginas Implementadas

| Rota | Descrição | Requisitos |
|:--|:--|:--|
| `/` | Página inicial | Pública |
| `/intencao` | Página de Intenção | Pública |
| `/indicacao` | Sistema de Indicações | JWT de ADMIN ou MEMBRO |
| `/admin` | Área do Administrador | JWT de ADMIN |
| `/convidado?token=...` | Página de cadastro via convite | Link gerado ao aprovar uma intenção |

🔗 **Ao aprovar uma intenção**, o backend exibirá no log:
```
Convite gerado: http://localhost:4000/convidado?token=${token}
```

---

## 🔐 Autenticação e Tokens

- **JWT_SECRET** → utilizado para assinar tokens do usuário.  
- **FRONT_PUBLIC_TOKEN** → usado para identificar o frontend publicamente.  
- **PRIVATE_TOKEN** → usado apenas em `/auth/register` para criar o primeiro usuário ADMIN interno.
- **NEXT_PUBLIC_JWT_TOKEN** → obtido ao realizar o login na rota `/auth/login` com um usuário válido.

---

## 🧪 Testes de API

O arquivo `testAPI.http` na raiz do projeto (no padrão da extensão REST Client do VSCode) contém exemplos de requisições dos endpoints para validações e uso local.

---

## 📘 Documentação Técnica

Consulte o arquivo [`ARQUITETURA.md`](./ARQUITETURA.md) para detalhes de:
- Estrutura de componentes do frontend  
- Modelo de dados completo  
- Endpoints da API  
- Fluxo de autenticação e convenções REST  

---

**Autor:** Eduardo Radieske  
**Data:** Novembro / 2025  