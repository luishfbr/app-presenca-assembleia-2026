# App Presença Assembleia 2026

Aplicação de controle de presença para assembleias, com suporte a múltiplos eventos, check-in por CPF via interface totem/kiosk, importação de convidados em lote e dashboard administrativo com estatísticas em tempo real.

## Funcionalidades

- **Check-in por CPF** — interface totem otimizada para tablets/totens
- **Multi-evento** — cada evento tem sua lista de convidados e check-ins independentes
- **Dashboard administrativo** — KPIs, gráficos por hora/usuário/evento e tabelas de check-ins
- **Importação em lote** — upload de convidados via CSV/XLSX com preview e relatório de erros
- **Gestão de usuários** — controle de acesso por role (admin / operador)
- **LGPD** — nome e CPF dos convidados criptografados no banco (AES-256-GCM)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS v4 · Shadcn UI |
| Autenticação | Better Auth (plugins: `admin`, `username`) |
| Banco de dados | PostgreSQL · Drizzle ORM |
| Estado / Requisições | TanStack Query v5 · Axios |
| Formulários | React Hook Form · Zod v4 |
| Gráficos | Recharts |
| Notificações | Sonner |
| Linguagem | TypeScript |
| Gerenciador de pacotes | pnpm |

## Rodando localmente

1. Instale as dependências:
   ```bash
   pnpm install
   ```

2. Configure as variáveis de ambiente (veja `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

3. Execute as migrações e o seed inicial:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.
