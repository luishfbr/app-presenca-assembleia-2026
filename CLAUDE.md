# CLAUDE.md — Contexto Global do Projeto

## Visão Geral

Aplicação de presença para assembleia 2026.
**Stack principal:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Drizzle ORM · PostgreSQL · Better Auth · TanStack Query v5 · Zod v4 · Axios · React Hook Form · Recharts · Sonner · Shadcn UI
**Gerenciador de pacotes:** pnpm

---

## Estrutura de Pastas

```
src/
├── app/                          # Routing ONLY — pages, layouts, API routes
│   ├── (auth)/login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (authenticated)/
│   │   ├── checkin/
│   │   │   ├── layout.tsx        # Redireciona admin → /dashboard
│   │   │   ├── page.tsx          # Seletor de evento para check-in
│   │   │   └── [eventSlug]/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx      # Fluxo de check-in por CPF dentro de um evento
│   │   └── dashboard/
│   │       ├── layout.tsx        # Redireciona non-admin → /checkin
│   │       ├── page.tsx          # Dashboard global — KPIs, gráficos e tabelas de todos os eventos
│   │       ├── events/
│   │       │   ├── page.tsx      # Lista de eventos
│   │       │   └── [eventSlug]/
│   │       │       ├── layout.tsx
│   │       │       ├── page.tsx          # Overview do evento
│   │       │       ├── checkins/page.tsx # Check-ins do evento
│   │       │       ├── convidados/
│   │       │       │   ├── page.tsx
│   │       │       │   └── importar/page.tsx  # Importação CSV/XLSX em lotes
│   │       │       └── usuarios/page.tsx      # Usuários atribuídos ao evento
│   │       └── usuarios/page.tsx         # Gestão global de usuários
│   ├── api/
│   │   ├── admin/presences/      # Protegidas por proxy.ts (admin only)
│   │   │   ├── events/
│   │   │   │   ├── route.ts      # GET (paginado + stats), POST
│   │   │   │   └── [slug]/
│   │   │   │       ├── route.ts          # PATCH, DELETE
│   │   │   │       └── users/
│   │   │   │           ├── route.ts      # GET (usuários do evento), POST (add)
│   │   │   │           └── [userId]/route.ts  # DELETE (remove)
│   │   │   ├── guests/
│   │   │   │   ├── route.ts      # GET (paginado + search in-memory), POST, DELETE (bulk)
│   │   │   │   ├── [id]/route.ts # PATCH, DELETE
│   │   │   │   └── import/route.ts  # POST — importação em lote
│   │   │   ├── checkins/
│   │   │   │   ├── route.ts      # GET (paginado), POST
│   │   │   │   └── [id]/route.ts # DELETE
│   │   │   └── stats/route.ts    # GET — KPIs, checkins by user/hour, recent checkins
│   │   ├── presences/            # Protegidas por sessão (qualquer role)
│   │   │   ├── events/route.ts   # GET — eventos do usuário logado
│   │   │   └── checkin/
│   │   │       ├── route.ts      # GET lookup por CPF+eventSlug, POST registra check-in
│   │   │       └── stats/route.ts  # GET — total e my checkins
│   │   └── auth/[...all]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Redireciona: admin→/dashboard, user→/checkin, anon→/login
│
├── features/                     # Módulos por domínio (business logic)
│   ├── events/
│   │   ├── api.ts                # eventsApi — CRUD + getUsers + addUser + removeUser
│   │   ├── public-api.ts         # publicEventsApi — getMyEvents()
│   │   ├── hooks.ts              # useEvents, useCreateEvent, useUpdateEvent,
│   │   │                         #   useDeleteEvent, useEventUsers, useAddUserToEvent,
│   │   │                         #   useRemoveUserFromEvent, useMyEvents
│   │   ├── types.ts              # GetEventsResponse, EventWithStats, GetEventsWithStatsResponse,
│   │   │                         #   EventUserWithUser, GetEventUsersResponse
│   │   ├── validations.ts        # createEventSchema, updateEventSchema (com refine startDate < endDate)
│   │   └── components/
│   │       ├── events-table.tsx
│   │       ├── create-event.tsx
│   │       ├── update-event.tsx
│   │       ├── delete-event.tsx
│   │       ├── event-tabs.tsx
│   │       ├── event-users-table.tsx
│   │       └── add-user-to-event.tsx
│   ├── guests/
│   │   ├── api.ts                # guestsApi — CRUD + importBatch + deleteAll
│   │   ├── hooks.ts              # useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest,
│   │   │                         #   useDeleteAllGuests, useImportGuests (chunked 500/batch)
│   │   ├── types.ts              # GetGuestsResponse, ImportGuestsResponse, ParsedGuestRow
│   │   ├── validations.ts        # createGuestSchema, updateGuestSchema
│   │   └── components/
│   │       ├── guests-table.tsx
│   │       ├── create-guest.tsx  # Dialog (form inline) com botão trigger
│   │       ├── update-guest.tsx  # Dialog (form inline) com ícone Pencil
│   │       ├── delete-guest.tsx  # AlertDialog com ícone Trash
│   │       ├── delete-all-guests.tsx    # AlertDialog para exclusão em massa
│   │       ├── import-guests.tsx        # Drag-and-drop CSV/XLSX upload
│   │       ├── import-preview-table.tsx # Pré-visualização antes de confirmar
│   │       └── import-result.tsx        # Resultado: inserted/duplicates/errors
│   ├── checkins/
│   │   ├── api.ts                # checkinsApi — CRUD admin
│   │   ├── public-api.ts         # checkinPublicApi — lookupByDocument, register, getStats
│   │   ├── hooks.ts              # useCheckins, useCreateCheckin, useDeleteCheckin,
│   │   │                         #   useCheckinStats, useLookupGuest, useRegisterCheckin
│   │   ├── types.ts              # CheckinWithRelations, GetCheckinsResponse, CheckinStatsResponse
│   │   ├── validations.ts        # documentSchema (CPF — 11 dígitos numéricos)
│   │   └── components/
│   │       ├── checkins-table.tsx        # Tabela admin de check-ins
│   │       ├── kiosk-checkin.tsx         # Fluxo completo de check-in (lookup → confirm → result)
│   │       ├── countdown-bar.tsx         # Barra de contagem regressiva para reset automático
│   │       ├── totem-button.tsx          # Botão totem (variants: primary | secondary)
│   │       ├── totem-card.tsx            # Card totem (variants: neutral | success | warning | error)
│   │       ├── totem-event-card.tsx      # Card clicável de seleção de evento (status automático)
│   │       └── totem-stats-footer.tsx    # Rodapé com contadores: meus registros + total
│   ├── stats/
│   │   ├── api.ts                # statsApi.get(eventSlug)
│   │   ├── hooks.ts              # useStats(options?)
│   │   ├── types.ts              # StatsData, GetStatsResponse, RECENT_CHECKINS_LIMIT
│   │   └── components/
│   │       ├── stats-kpi-cards.tsx           # KPIs de um evento específico
│   │       ├── checkins-by-hour-chart.tsx    # Gráfico por hora (evento)
│   │       ├── checkins-by-user-chart.tsx    # Gráfico por usuário (evento)
│   │       ├── recent-checkins-table.tsx     # Últimos check-ins (evento)
│   │       ├── global-kpi-cards.tsx          # KPIs globais (todos os eventos)
│   │       ├── checkins-by-event-chart.tsx   # Gráfico por evento (dashboard global)
│   │       ├── events-summary-table.tsx      # Resumo de eventos (dashboard global)
│   │       └── global-recent-checkins-table.tsx  # Últimos check-ins globais
│   └── users/
│       ├── hooks.ts              # useAdmin() (lista+paginação+CRUD), useCreateUser()
│       ├── validations.ts        # createUserSchema, updateUserSchema
│       └── components/
│           ├── users-table.tsx
│           ├── create-user.tsx
│           ├── update-user.tsx
│           └── delete-user.tsx
│
├── components/                   # Componentes compartilhados
│   ├── ui/                       # Shadcn — não modificar manualmente
│   ├── layout/
│   │   ├── dashboard-header.tsx  # Breadcrumbs dinâmicos + ModeToggle
│   │   └── dashboard-inset.tsx   # Wrapper de conteúdo (max-w-5xl)
│   ├── auth/
│   │   └── login-form.tsx
│   ├── providers.tsx             # QueryClientProvider
│   └── theme-provider.tsx
│
├── db/
│   ├── client.ts                 # Instância Drizzle (PostgreSQL + SSL)
│   ├── migrations/               # Gerado pelo Drizzle Kit
│   ├── schema/
│   │   ├── auth/                 # Tabelas Better Auth (NÃO MODIFICAR)
│   │   │   ├── users.ts
│   │   │   ├── sessions.ts
│   │   │   ├── accounts.ts
│   │   │   ├── verifications.ts
│   │   │   └── auth-relations.ts
│   │   ├── presence/
│   │   │   ├── events.ts         # Eventos (name, slug, startDate, endDate)
│   │   │   ├── event-users.ts    # Junção evento ↔ usuário (unique eventId+userId)
│   │   │   ├── guests.ts         # Convidados por evento; name e document criptografados
│   │   │   └── checkins.ts       # Check-ins por evento
│   │   └── index.ts              # Registra todas as tabelas no objeto schema
│   └── seed.ts                   # Cria admin via auth.api.signUpEmail + seta role
│
├── hooks/                        # Hooks globais/compartilhados
│   ├── use-auto-reset.ts         # Countdown timer; chama onReset() ao zerar
│   ├── use-mobile.ts
│   └── use-media-query.ts
│
├── server/                       # Código server-only (NUNCA importar em client components)
│   ├── auth.ts                   # Configuração Better Auth + exports Session e User
│   └── session.ts                # getServerSession() com React cache
│
├── lib/                          # Utilitários puros e agnósticos
│   ├── api-utils.ts              # paginationSchema (limit, offset, search), PaginationParams
│   ├── auth-client.ts            # Better Auth browser client (plugins: admin, username, nextCookies)
│   ├── axios-client.ts           # Instância Axios (baseURL: /api, withCredentials, timeout 10s)
│   ├── crypto.ts                 # encrypt/decrypt (AES-256-GCM) + hashForSearch (HMAC-SHA256)
│   ├── env.ts                    # Variáveis de ambiente validadas com Zod
│   └── utils.ts                  # cn(), maskDocument(), generateSlug()
│
├── validations/
│   └── auth.ts                   # loginSchema (username + password), LoginType
│
└── proxy.ts                      # Proteção /api/admin/** — exige sessão + role === "admin"
                                  # (exporta `proxy` + `config` com matcher)
```

---

## Regras de Localização de Arquivos

| Tipo de arquivo | Onde vai |
|-----------------|----------|
| Config de auth (BetterAuth), getServerSession | `src/server/` |
| Cliente HTTP admin por domínio (axiosClient) | `src/features/[domínio]/api.ts` |
| Cliente HTTP público (sem admin) por domínio | `src/features/[domínio]/public-api.ts` |
| Hooks de dados (useQuery/useMutation) | `src/features/[domínio]/hooks.ts` |
| Tipos de resposta HTTP | `src/features/[domínio]/types.ts` |
| Schemas Zod de form/validação | `src/features/[domínio]/validations.ts` |
| Componentes específicos de um domínio | `src/features/[domínio]/components/` |
| Componentes de layout (header, inset) | `src/components/layout/` |
| Componentes usados em mais de um feature | `src/components/` |
| Funções puras sem side effects | `src/lib/` |
| Hooks globais | `src/hooks/` |
| Schemas Zod de auth/login | `src/validations/auth.ts` |

---

## Modelo de Dados — Arquitetura Multi-Evento

Todos os recursos de presença são **escopados por evento**:

```
events (1) ──── (N) event_users  ←→ users
events (1) ──── (N) guests
events (1) ──── (N) checkins
guests (1) ──── (N) checkins
```

- **`events`** — Evento com `name`, `slug` (único, gerado do nome), `startDate`, `endDate`
- **`event_users`** — Junção evento ↔ usuário; unique `(eventId, userId)`; cascade delete
- **`guests`** — Convidado vinculado a um evento; unique `(documentHash, eventId)`; cascade delete do evento
- **`checkins`** — Registro de check-in vinculado a evento + convidado + usuário; cascade delete do evento

### Campo `type` em guests

`guests.type` é um `text` obrigatório. Representa o tipo/categoria do convidado (definido pela aplicação/importação).

### Slug em events

`events.slug` é gerado automaticamente no route handler a partir do `name` usando `generateSlug()` de `src/lib/utils.ts`. É único e usado como identificador nas URLs (ex: `/dashboard/events/[eventSlug]`). Nunca exposto no form de criação/edição.

---

## Criptografia (LGPD)

Dados sensíveis de convidados (nome e documento) são criptografados no banco com AES-256-GCM via `src/lib/crypto.ts`.

```ts
import { encrypt, decrypt, hashForSearch } from "@/lib/crypto";

// Ao salvar no banco
const encryptedName = encrypt(name);          // "{iv}:{authTag}:{ciphertext}"
const encryptedDoc  = encrypt(document);
const documentHash  = hashForSearch(document); // HMAC-SHA256 determinístico

// Ao ler do banco — sempre descriptografar antes de retornar ao cliente
const plainName = decrypt(guest.name);
const plainDoc  = decrypt(guest.document);
```

**Regras:**
- `encrypt`/`decrypt` usam `ENCRYPTION_KEY` (32 bytes em hex) e IV aleatório por registro
- `hashForSearch` usa `HMAC_KEY` (32 bytes em hex) — permite constraint UNIQUE e lookup exato
- A constraint unique de documento é `(documentHash, eventId)` — o mesmo CPF pode existir em eventos distintos
- Busca full-text por campos criptografados é feita **in-memory** (fetch all → decrypt → filter)
- Nunca retornar campos criptografados brutos para o cliente — sempre descriptografar na route handler
- `documentHash` é omitido do `insertGuestSchema` (calculado internamente no route handler)

---

## Utilitários em `src/lib/utils.ts`

```ts
import { cn, maskDocument, generateSlug } from "@/lib/utils";

cn("foo", condition && "bar")         // clsx + tailwind-merge
maskDocument("12345678901")           // "*********01" — oculta todos exceto os 2 últimos dígitos
generateSlug("Assembleia 2026!")      // "assembleia-2026" — URL-safe, lowercase, sem acentos
```

---

## Padrões de Schema (Drizzle + drizzle-zod)

Cada arquivo de tabela em `src/db/schema/presence/` deve exportar:

```ts
export const entity = pgTable("entity", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  // ... campos
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const entityRelations = relations(entity, ({ one, many }) => ({ ... }));

export const selectEntitySchema = createSelectSchema(entity);
export const insertEntitySchema = createInsertSchema(entity).omit({ id: true, createdAt: true, updatedAt: true });
export const updateEntitySchema = createUpdateSchema(entity);

export type Entity       = z.infer<typeof selectEntitySchema>;
export type NewEntity    = z.infer<typeof insertEntitySchema>;
export type EntityUpdate = z.infer<typeof updateEntitySchema>;
```

Após criar tabelas, registrar em `src/db/schema/index.ts` dentro do objeto `schema` (tabela + relações).

**Nota sobre `updatedAt`:** Nas tabelas `guests` e `checkins`, `updatedAt` usa `.$onUpdate(() => new Date())` em vez de `.defaultNow()`.

**Campos criptografados** (guests): `name` e `document` são `text` no banco (cipher text). `documentHash` é `text` (HMAC) com unique composto `(documentHash, eventId)`.

---

## Padrões de API Route

### Localização
- Admin (protegida por `proxy.ts`): `src/app/api/admin/presences/[resource]/route.ts`
- Item admin por slug: `src/app/api/admin/presences/events/[slug]/route.ts`
- Item admin por id: `src/app/api/admin/presences/[resource]/[id]/route.ts`
- Sub-recurso admin: `src/app/api/admin/presences/[resource]/[slug]/[subresource]/route.ts`
- Pública (requer sessão, qualquer role): `src/app/api/presences/[resource]/route.ts`

### Respostas padronizadas

| Situação              | Shape                                                           | Status |
|-----------------------|-----------------------------------------------------------------|--------|
| Sucesso (lista)       | `{ data: T[], pagination: { total, limit, offset, hasMore } }` | 200    |
| Sucesso (item)        | `{ data: T }`                                                   | 200/201|
| Body/params inválido  | `{ error: string, details?: ZodFieldErrors }`                   | 400    |
| Não autenticado       | `{ error: "Não autorizado" }`                                   | 401    |
| Sem permissão         | `{ error: "Acesso negado" }`                                    | 403    |
| Não encontrado        | `{ error: "... não encontrado" }`                               | 404    |
| Conflito único (PG)   | `{ error: "... já cadastrado" }` (pg error code `23505`)        | 409    |
| Erro interno          | `{ error: "Erro ao ..." }`                                      | 500    |

### Estrutura interna de um route handler

```ts
export async function GET(req: NextRequest) {
  // 1. Validar query params
  const parsed = paginationSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success)
    return NextResponse.json({ error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { limit, offset, search } = parsed.data;

  // 2. Query no banco
  try {
    const rows = await db.select().from(entity).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(entity);

    // 3. Para campos criptografados: descriptografar e filtrar in-memory
    const decrypted = rows.map(r => ({ ...r, name: decrypt(r.name), document: decrypt(r.document) }));
    const filtered = search ? decrypted.filter(r => r.name.toLowerCase().includes(search.toLowerCase())) : decrypted;

    return NextResponse.json({
      data: filtered,
      pagination: { total: Number(count), limit, offset, hasMore: offset + limit < Number(count) },
    });
  } catch (error) {
    console.error("[GET /api/admin/presences/entity]", error);
    return NextResponse.json({ error: "Erro ao buscar entidades" }, { status: 500 });
  }
}
```

### Log de erros
```ts
console.error("[METHOD /api/admin/presences/resource]", error);
// ou para API pública:
console.error("[METHOD /api/presences/resource]", error);
```

---

## Padrões de Service (Cliente HTTP)

### Admin API (`src/features/[domínio]/api.ts`)

```ts
import { axiosClient } from "@/lib/axios-client";
import type { GetEntityResponse } from "./types";
import type { NewEntity, EntityUpdate, Entity } from "@/db/schema/presence/entity";

export const entityApi = {
  getAll: (params: { limit: number; offset: number; search?: string }) =>
    axiosClient.get<GetEntityResponse>("/admin/presences/entity", { params }).then(r => r.data),
  getById: (id: string) =>
    axiosClient.get<{ data: Entity }>(`/admin/presences/entity/${id}`).then(r => r.data),
  create: (body: NewEntity) =>
    axiosClient.post<{ data: Entity }>("/admin/presences/entity", body).then(r => r.data),
  update: (id: string, body: EntityUpdate) =>
    axiosClient.patch<{ data: Entity }>(`/admin/presences/entity/${id}`, body).then(r => r.data),
  delete: (id: string) =>
    axiosClient.delete<{ data: Entity }>(`/admin/presences/entity/${id}`).then(r => r.data),
};
```

> **Nota eventos:** eventos usam `slug` no lugar de `id` nas URLs da API.
> Ex: `eventsApi.getBySlug(slug)` → `GET /admin/presences/events/${slug}`

### Public API (`src/features/[domínio]/public-api.ts`)

Para endpoints acessíveis por qualquer usuário autenticado (não apenas admin):

```ts
import { axiosClient } from "@/lib/axios-client";

export const publicEntityApi = {
  lookup: (document: string, eventSlug: string) =>
    axiosClient.get<{ data: Entity }>("/presences/entity", { params: { document, eventSlug } }).then(r => r.data),
  register: (entityId: string, eventSlug: string) =>
    axiosClient.post<{ data: Entity }>("/presences/entity", { entityId, eventSlug }).then(r => r.data),
};
```

### Users — sem api.ts

O feature `users` **não tem `api.ts`** — operações de usuário usam `authClient.admin` diretamente nos hooks:

```ts
import { authClient } from "@/lib/auth-client";

await authClient.admin.createUser({ name, email, username, password, role });
await authClient.admin.updateUser({ userId: id, data: { name, username, role } });
await authClient.admin.removeUser({ userId: id });
const { data } = await authClient.admin.listUsers({ query: { limit, offset } });
```

---

## Padrões de Types

Localização: `src/features/[domínio]/types.ts`

```ts
import type { Entity } from "@/db/schema/presence/entity";

export type GetEntityResponse = {
  data: Entity[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

// Para recursos com relações:
export type EntityWithRelations = Entity & {
  relatedEntity: RelatedEntity;
};

// Para recursos com stats agregadas:
export type EntityWithStats = Entity & {
  totalItems: number;
};
```

---

## Padrões de Validations (Zod)

Localização: `src/features/[domínio]/validations.ts`

```ts
import { z } from "zod";

export const createEntitySchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  // campos obrigatórios
});

export const updateEntitySchema = createEntitySchema.partial();

export type CreateEntityType = z.infer<typeof createEntitySchema>;
export type UpdateEntityType = z.infer<typeof updateEntitySchema>;
```

**Nota:** Validações com dependência entre campos (ex: `endDate > startDate`) usam `.refine()`.

---

## Padrões de Hooks de Dados

Localização: `src/features/[domínio]/hooks.ts`

```ts
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { entityApi } from "./api";
import type { NewEntity, EntityUpdate } from "@/db/schema/presence/entity";

export function useEntities(params: { limit: number; offset: number; search?: string }) {
  return useQuery({
    queryKey: ["entity", params],
    queryFn: () => entityApi.getAll(params),
    placeholderData: keepPreviousData,  // evita flash de loading na paginação
  });
}

export function useCreateEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NewEntity) => entityApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity"] });
      toast.success("Entidade criada com sucesso!");
    },
    onError: () => toast.error("Erro ao criar entidade."),
  });
}

export function useUpdateEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: EntityUpdate }) => entityApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity"] });
      toast.success("Entidade atualizada!");
    },
    onError: () => toast.error("Erro ao atualizar entidade."),
  });
}

export function useDeleteEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => entityApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entity"] });
      toast.success("Entidade removida!");
    },
    onError: () => toast.error("Erro ao remover entidade."),
  });
}
```

### QueryKey convention
- Lista: `["entity", params]` — params é o objeto inteiro (limit, offset, search)
- Item único: `["entity", id]`
- Item por slug: `["entity", slug]`
- Sub-recurso: `["entity-subresource", parentId]`
- Invalidar tudo do recurso: `{ queryKey: ["entity"] }`

---

## Padrões de Componentes de Feature

Cada domínio em `src/features/[domínio]/components/` segue este conjunto mínimo:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `entities-table.tsx` | Tabela com linhas e botões de ação (update, delete) |
| `create-entity.tsx` | Dialog com botão trigger e form inline |
| `update-entity.tsx` | Dialog com ícone Pencil, recebe `entity` como prop |
| `delete-entity.tsx` | AlertDialog com ícone Trash, recebe `id` como prop |

> **Nota:** Não existe `entity-form.tsx` separado — o form é **inline** dentro de `create-entity.tsx` e `update-entity.tsx`, usando o mesmo `useForm` com valores default.

### Padrão de Dialog (Create/Update)

```tsx
"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateEntity() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateEntity();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateEntityType>({
    resolver: zodResolver(createEntitySchema),
  });

  function onSubmit(data: CreateEntityType) {
    mutate(data, { onSuccess: () => { setOpen(false); reset(); } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Nova entidade</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova entidade</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="name" control={control} render={({ field }) => (
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...field} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          )} />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Padrão de AlertDialog (Delete)

```tsx
"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function DeleteEntity({ id }: { id: string }) {
  const { mutate, isPending } = useDeleteEntity();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate(id)} disabled={isPending}>
            {isPending ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Padrões de Page

Pages em `src/app/(authenticated)/dashboard/[recurso]/page.tsx` são sempre `"use client"`:

```tsx
"use client";
import { useState } from "react";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { ErrorComponent } from "@/components/ui/error-components";
import { CustomPagination } from "@/components/ui/custom-pagination";

const LIMIT = 14; // ajuste por recurso

export default function EntityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const offset = (currentPage - 1) * LIMIT;
  const { data, isLoading, isError } = useEntities({ limit: LIMIT, offset, search });

  if (isLoading) return <DefaultLoadingComponent />;
  if (isError) return <ErrorComponent />;

  const totalPages = Math.ceil((data?.pagination.total ?? 0) / LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <CreateEntity />
      </div>
      <EntitiesTable entities={data?.data ?? []} />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}
```

> **Nota:** `CustomPagination` recebe `setCurrentPage` (não `onPageChange`).

---

## Componentes UI Reutilizáveis

```tsx
// Loading states
import { DefaultLoadingComponent, DefaultLoadingPage, DefaultLoadingButton } from "@/components/ui/loading-comp";

<DefaultLoadingComponent />                                          // Spinner centralizado (dentro de seção)
<DefaultLoadingPage />                                               // Spinner tela cheia
<DefaultLoadingButton disabled={isPending} loading={isPending}      // Botão com spinner
  label="Salvar" form="my-form" />

// Error state
import { ErrorComponent } from "@/components/ui/error-components";
<ErrorComponent message="Mensagem personalizada" />                  // Texto de erro centralizado (message opcional)

// Paginação
import { CustomPagination } from "@/components/ui/custom-pagination";
<CustomPagination currentPage={page} totalPages={total} setCurrentPage={setPage} />
```

---

## Autenticação

```ts
// Server Components / Route Handlers
import { getServerSession } from "@/server/session";
const session = await getServerSession(); // retorna Session | null

// Client Components
import { authClient } from "@/lib/auth-client";
const { data: session } = authClient.useSession();

// Login (client)
await authClient.signIn.username({ username, password });

// Logout (client)
await authClient.signOut();

// Gerenciamento de usuários (admin, client)
await authClient.admin.createUser({ name, email, username, password, role });
await authClient.admin.updateUser({ userId, data: { name, username, role } });
await authClient.admin.removeUser({ userId });
const { data } = await authClient.admin.listUsers({ query: { limit, offset } });

// Tipo User
import type { User } from "@/server/auth";
// User contém: id, name, email, username, role ("admin" | "user"), createdAt
```

**Proteção de rotas API:**
- `src/proxy.ts` exporta `proxy` (handler) + `config` (matcher `/api/admin/:path*`) — exige sessão + `role === "admin"`
- `/api/presences/**` exige apenas sessão válida (qualquer role)

**Redirecionamento por role:**
- `admin` → `/dashboard`
- `user` → `/checkin`
- sem sessão → `/login`

---

## Variáveis de Ambiente

| Variável               | Uso                                                       |
|------------------------|-----------------------------------------------------------|
| `DATABASE_URL`         | String de conexão PostgreSQL (`postgresql://...`)         |
| `BETTER_AUTH_SECRET`   | Segredo do Better Auth                                    |
| `ENCRYPTION_KEY`       | Chave AES-256-GCM — 64 chars hex (32 bytes) — LGPD       |
| `HMAC_KEY`             | Chave HMAC-SHA256 — 64 chars hex (32 bytes) — busca hash |
| `ADMIN_USERNAME`       | Usuário admin para seed                                   |
| `ADMIN_PASSWORD`       | Senha admin para seed                                     |
| `ADMIN_EMAIL`          | Email admin para seed                                     |
| `ADMIN_FULLNAME`       | Nome completo admin para seed                             |

---

## Convenções Gerais

- **IDs:** `crypto.randomUUID()` (UUID v4 string) via `$defaultFn`
- **Slugs (events):** Gerado a partir do `name` com `generateSlug()` no route handler; único no banco; usado nas URLs
- **Timestamps:** `createdAt` e `updatedAt` como `timestamp` (not null) em todas as tabelas
- **`updatedAt` auto-update:** em `guests` e `checkins` usa `.$onUpdate(() => new Date())`
- **Criptografia:** Campos sensíveis (nome, documento) → `encrypt()` ao salvar, `decrypt()` ao ler
- **Busca em campos criptografados:** fetch all → decrypt in-memory → filter (não há full-text no banco)
- **Escopo por evento:** guests e checkins sempre têm `eventId`; unique de documento é `(documentHash, eventId)`
- **Idioma:** Mensagens de erro e UI em português (pt-BR)
- **Toast:** `sonner` — `toast.success(...)` / `toast.error(...)`
- **Loading/Error:** `<DefaultLoadingComponent />` e `<ErrorComponent />` de `src/components/ui/`
- **Imports:** Alias `@/` para todos os imports internos
- **Formulários:** React Hook Form + `zodResolver` com `<Controller>` para todos os campos (inline nos dialogs)
- **Componentes UI:** Preferir `src/components/ui/` (Shadcn)
- **Paginação:** `<CustomPagination currentPage={} totalPages={} setCurrentPage={} />` de `src/components/ui/custom-pagination.tsx`
- **Paginação sem flash:** usar `placeholderData: keepPreviousData` no useQuery de listas paginadas
- **Gráficos:** Recharts (via Shadcn chart wrapper em `src/components/ui/chart.tsx`)
- **Server components:** Importações server-only ficam em `src/server/` — nunca importar em `"use client"`
- **Refresh automático:** usar `refetchInterval` no useQuery (ex: `refetchInterval: 30_000` no dashboard)
- **Countdown timer:** `useAutoReset(active, onReset, seconds)` de `src/hooks/use-auto-reset.ts` — retorna segundos restantes
- **Mascarar documento:** `maskDocument(doc)` de `src/lib/utils.ts` — oculta todos exceto os 2 últimos dígitos

---

## Totem / Checkin — Design Tokens

A área de checkin é uma interface totem/kiosk com fundo verde (#7DB61C via imagem de fundo). Todos os componentes seguem os mesmos tokens visuais derivados do `NumericKeypad`.

### Tokens base

| Token | Classe Tailwind | Uso |
|-------|----------------|-----|
| Fundo glass | `bg-black/30` | Todas as superfícies: cards, footer, display CPF, teclas |
| Borda sutil | `border-white/25` | Teclas normais, card neutro, footer, display CPF, evento agendado |
| Borda destaque | `border-white/60` | Tecla confirm, card success, evento em andamento |
| Borda fraca | `border-white/10` | Evento encerrado (item inativo) |
| Primário (ação) | `bg-white/90 text-green-800` | Tecla confirm, `TotemButton` primary, badge "Em andamento" |
| Feedback press | `active:bg-white/30` | Teclas, `TotemButton` secondary, `TotemEventCard` |
| Borda warning | `border-yellow-400/60` | `TotemCard` variant warning |
| Borda error | `border-red-400/60` | `TotemCard` variant error |
| Texto muted | `text-white/70` | Labels, ícones, texto secundário |
| Texto dim | `text-white/50` | Evento encerrado, item inativo |

### Componentes totem e seus tokens

```tsx
// TotemButton — src/features/checkins/components/totem-button.tsx
// primary  → bg-white/90 text-green-800 border-2 border-white/60
// secondary → bg-black/30 text-white border-2 border-white/25 active:bg-white/30
<TotemButton variant="primary" onClick={confirm}>Confirmar</TotemButton>
<TotemButton variant="secondary" onClick={cancel}>Cancelar</TotemButton>

// TotemCard — src/features/checkins/components/totem-card.tsx
// neutral → border-white/25   success → border-white/60
// warning → border-yellow-400/60   error → border-red-400/60
// base: bg-black/30 backdrop-blur-md border-2 rounded-3xl
<TotemCard variant="success"><p>Check-in realizado!</p></TotemCard>

// TotemEventCard — src/features/checkins/components/totem-event-card.tsx
// base: bg-black/30 border-2 active:bg-white/30
// "Em andamento" → border-white/60, badge bg-white/90 text-green-800
// "Agendado"     → border-white/25, badge bg-white/20 text-white
// "Encerrado"    → border-white/10, badge bg-black/30 text-white/50
<TotemEventCard name={e.name} startDate={e.startDate} endDate={e.endDate} onClick={...} />

// TotemStatsFooter — src/features/checkins/components/totem-stats-footer.tsx
// base: bg-black/30 border border-white/25 rounded-2xl
<TotemStatsFooter myCheckins={3} totalCheckins={120} />

// NumericKeypad — src/components/ui/numeric-keypad.tsx
// display: bg-black/30 border-2 border-white/25
// tecla normal: bg-black/30 border border-white/25 active:bg-white/30
// tecla confirm: bg-white/90 text-green-800 border-white/60
<NumericKeypad value={cpf} onChange={setCpf} onConfirm={handleLookup} />
```

### Regra de padronização

Ao criar ou modificar qualquer componente na área de checkin/totem:
- **Fundo:** sempre `bg-black/30 backdrop-blur-md`
- **Borda padrão:** `border-white/25` (1px) ou `border-2 border-white/25` (cards)
- **Borda ativa/positiva:** `border-white/60`
- **Ação primária:** `bg-white/90 text-green-800 border-white/60`
- **Ação secundária:** `bg-black/30 text-white border-white/25 active:bg-white/30`
- **Nunca usar** cores opacas (`bg-white`, `bg-green-*` sólido) — manter sempre a transparência glass
