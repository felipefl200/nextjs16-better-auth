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

O projeto adota a **Clean Architecture** separando claramente as responsabilidades em camadas desacopladas:

```text
src/
├── app/                      # App Router (Next.js 16)
│   ├── (protected)/          # Route Group para rotas autenticadas
│   │   ├── dashboard/        # Página de Dashboard
│   │   ├── profile/          # Página de Perfil
│   │   ├── settings/         # Página de Configurações
│   │   ├── layout.tsx        # Layout centralizado de autenticação
│   │   ├── error.tsx         # Boundary de erro universal
│   │   ├── loading.tsx       # State de carregamento universal
│   │   └── SessionRefresher.tsx # Sincronizador de sessão client-side
│   ├── login/                # Tela de Login
│   └── register/             # Tela de Cadastro
├── application/              # Camada de Casos de Uso (Use Cases) & Ports
│   ├── ports/                # Interfaces/Contratos (ex: AuthGateway)
│   └── use-cases/            # Regras de Negócio de Aplicação (GetSession, Login, Logout, Register)
├── domain/                   # Camada de Domínio (Entidades e Erros puros)
│   ├── entities/             # User, Session
│   └── errors/               # Exceções de Domínio (InvalidCredentialsError, etc)
├── infrastructure/           # Adaptadores e Conexões Externas
│   └── auth/                 # Implementação de Gateway (FetchAuthGateway, ServerAuthGatewayFactory, getRequiredSession)
└── proxy.ts                  # Edge Middleware (Next.js 16) para validação otimista de sessão
```

---

## 🌟 Destaques Arquiteturais

1. **Edge Middleware Proxy (`src/proxy.ts`)**: Validação otimista de cookies de sessão (`meu-app.session_token`) na borda da rede antes do render dos Server Components, sem chamadas I/O bloqueantes.
2. **Route Group Autenticado (`(protected)`)**: Layout centralizado (`layout.tsx`) que executa a guarda de segurança para todas as rotas filhas (`/dashboard`, `/profile`, `/settings`), eliminando código repetido nas páginas.
3. **Memoização de Requisições (`getRequiredSession`)**: Utilitário que integra a Clean Architecture ao Next.js Server Components. Reutiliza o cache automático do `fetch` do Next.js para garantir que o layout e as páginas façam no máximo uma única requisição HTTP real ao backend por *render pass*.
4. **Renovação por Eventos (`SessionRefresher`)**: Sincronização de cookies client-side engatilhada sob demanda durante navegações de rotas (`usePathname`), sem a necessidade de *polling* por intervalo (`setInterval`).

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
BASE_URL="http://localhost:3001"
```

### 3. Iniciar em Modo de Desenvolvimento

```bash
npm run dev
```

Acesse a aplicação em `http://localhost:3000`.

### 4. Build de Produção e Verificação

Para gerar e validar a compilação de produção:

```bash
npm run build
npm run start
```

---

## 📄 Licença

Este projeto é parte de uma demonstração de boas práticas de arquitetura front-end e integrações limpas. Fique à vontade para utilizá-lo como referência.
