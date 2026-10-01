# Next.js + Better Auth Frontend Integration

Aplicação web desenvolvida em **Next.js 16** com **React 19** integrada ao **Better Auth** (NestJS backend), seguindo princípios rigorosos de **Clean Architecture**, **SOLID** e **Clean Code**.

---

## 🛠️ Tecnologias e Versões

| Tecnologia / Lib | Versão / Tag | Descrição |
| :--- | :--- | :--- |
| **Next.js** | `16.2.12` | Framework React com App Router e Edge Middleware (`proxy.ts`) |
| **React** | `19.2.4` | Biblioteca para construção de interfaces declarativas |
| **React DOM** | `19.2.4` | Renderizador DOM para o React |
| **Better Auth** | `^1.6.25` | Sistema de Autenticação flexível e seguro |
| **Tailwind CSS** | `^4.0.0` | Framework CSS utilitário para estilização |
| **TypeScript** | `^5.0.0` | Superset JavaScript tipado estaticamente |
| **Node.js** | `>=20.0.0` | Ambiente de execução JavaScript servidor |

---

## 🏛️ Arquitetura do Projeto

O projeto adota a **Clean Architecture** separando claramente as responsabilidades em camadas desacopladas (alias `@/*` → `src/*`):

```text
src/
├── app/                      # App Router (Next.js 16)
│   ├── (auth)/               # Route Group público: login e cadastro
│   │   ├── login/            # page.tsx (server) + LoginForm.tsx (client)
│   │   └── register/         # page.tsx (server) + RegisterForm.tsx (client)
│   ├── (protected)/          # Route Group para rotas autenticadas
│   │   ├── dashboard/ profile/ settings/
│   │   ├── layout.tsx        # Guarda do primeiro carregamento + Navbar + <main>
│   │   ├── error.tsx         # Boundary de erro das páginas protegidas
│   │   └── loading.tsx       # Estado de carregamento
│   ├── error.tsx             # Boundary de erro de layouts (ex.: backend fora do ar)
│   └── layout.tsx            # Layout raiz + metadata
├── components/               # Navbar, LogoutButton, SessionRefresher, ErrorView, PageHeader
│   └── auth/                 # AuthCard, FormField, FormError
├── application/              # Casos de Uso & Ports (AuthGateway)
├── domain/                   # Entidades (User, Session) e erros de domínio
├── infrastructure/
│   ├── auth/                 # FetchAuthGateway, ServerAuthGatewayFactory, getRequiredSession,
│   │                         # clientAuth (fábricas de casos de uso), safeRedirect, constants
│   └── config/env.ts         # Leitura e validação de API_URL
└── proxy.ts                  # Proxy (middleware) com checagem otimista do cookie
```

---

## 🔐 Fluxo de Autenticação

1. **Proxy (`src/proxy.ts`)**: todas as rotas são protegidas por padrão, exceto `/`, `/login`, `/register`, `/api` e assets. Sem o cookie `meu-app.session_token`, redireciona para `/login?callbackUrl=<rota original>`. É apenas uma checagem otimista (presença do cookie), sem I/O.
2. **Validação no servidor (`getRequiredSession`)**: **toda página protegida deve chamá-la**. O layout de `(protected)` também chama, mas layouts **não re-renderizam em navegações client-side**, então ele só protege o primeiro carregamento. A busca é memoizada com `cache()` do React: layout e página fazem uma única requisição por request. Apenas os cookies do Better Auth são repassados ao backend.
3. **`SessionRefresher`**: a cada navegação client-side valida a sessão (o Better Auth responde `200` com `null` quando não há sessão) e renova o cookie. Sessão inexistente → `/login?callbackUrl=...`; falhas de rede ou 5xx não deslogam o usuário.
4. **Login/cadastro**: as páginas validam a sessão no servidor e redirecionam usuários já autenticados. O `callbackUrl` é sanitizado (`sanitizeCallbackUrl`) para aceitar apenas caminhos internos, evitando *open redirect*.
5. **Erros**: o `FetchAuthGateway` lê o `code` retornado pelo Better Auth (`INVALID_EMAIL_OR_PASSWORD`, `USER_ALREADY_EXISTS*`, `PASSWORD_TOO_SHORT`, `INVALID_EMAIL`, ...) e o converte em erros de domínio. A UI só exibe mensagens de `AuthError`.

## ♿ HTML Semântico e Acessibilidade

- Landmarks: `<header>`, `<nav aria-label="Principal">` com lista, um único `<main>` por página e link "Pular para o conteúdo".
- Formulários: todo `<input>` tem `<label htmlFor>`, `autoComplete` adequado, `<fieldset>`/`<legend>` e erros anunciados com `role="alert"`.
- Conteúdo: seções com `aria-labelledby`, cards como `<article>`, pares rótulo/valor em `<dl>`, `aria-current="page"` no menu e ícones decorativos com `aria-hidden`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** `>= 20.0.0`
- **npm** ou **yarn** / **pnpm**
- Backend **NestJS + Better Auth** rodando em `http://localhost:3001` (ou na porta configurada)

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/seu-usuario/next-betterauth.git
cd next-betterauth
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
API_URL="http://localhost:3001"
```

### 3. Iniciar em Modo de Desenvolvimento

```bash
npm run dev
```

Acesse a aplicação em `http://localhost:3000`.

### 4. Qualidade

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
npm test           # Testes unitários (Vitest)
```

### 5. Build de Produção

```bash
npm run build
npm run start
```

---

## 📄 Licença

Este projeto é parte de uma demonstração de boas práticas de arquitetura front-end e integrações limpas. Fique à vontade para utilizá-lo como referência.
