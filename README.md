# Organiza Isso - Plataforma de Agendamento

Organiza Isso é uma aplicação fullstack moderna para agendamento de serviços com prestadores. Este repositório segue um monorepo com organização em pacotes (Zod, configurações de TS) e aplicações (API REST NestJS).

## 💻 Frontend

### Web (Next.js)

- **Framework:** Next.js (SSR/SSG)
- **Deploy:** AWS Amplify ou Vercel

**Funcionalidades:**
- Página pública com horários de prestadores
- Painel de gerenciamento (agenda e reservas)
- Autenticação via JWT (Cognito/Keycloak)

### Mobile (React Native)

- **Framework:** React Native (Expo opcional)

**Funcionalidades:**
- Agendamento rápido e intuitivo
- Visualização de agenda e horários
- Notificações push (FCM)
- Autenticação JWT (Cognito depois Keycloak)

---

## 🌐 Backend/API

### Tecnologias

- **Framework:** NestJS + TypeScript
- **ORM:** Prisma ORM
- **Validação:** Zod + nestjs-zod
- **Autenticação:** JWT (com suporte a RBAC e @RoleGuard)
- **Deploy:** AWS ECS Fargate ou Lambda

### Estrutura REST

```
/api/v1
  ├── /auth (login, registro, refresh)
  ├── /users (perfil, gerenciamento)
  ├── /professionals (agenda pública, horários)
  ├── /appointments (reservas, fila de espera)
  ├── /notifications (push e e-mails)
  └── /companies (cadastro, profissionais, horários)
```

### Autenticação

- JWT com cookies HttpOnly
- Inicial: AWS Cognito
- Futuro: Keycloak via OAuth2

---

## 📋 Banco de Dados

- **Database:** AWS Aurora PostgreSQL Serverless
- **Cache:** Redis (ElastiCache)
- **ORM:** Prisma

### Estrutura:

```
Users
  ├── id, email, password (hashed), role

Companies
  ├── id, name, description, ownerId, createdAt

Professionals
  ├── id, userId, specialties, profile, companyId

Appointments
  ├── id, providerId, clientId, scheduleId, status, assignedToId[]

Notifications
  ├── id, userId, type, message, deliveredAt

Schedule
  ├── id, professionalId, companyId, dateTime, isAvailable
```

---

## 📨 Notificações

- **Push:** Firebase Cloud Messaging (FCM)
- **Emails:** AWS SES

---

## 📂 Armazenamento

- **Arquivos:** Amazon S3
- **CDN:** AWS CloudFront

---

## ⚖️ Fluxo de Reserva

1. Cliente visualiza horários de um prestador ou empresa
2. Reserva ou entra na lista de espera
3. Disponibilidade é validada em tempo real
4. Reserva confirmada gera notificações
5. Lista de espera é notificada em desistências
6. Agendamento é atribuído a um ou mais profissionais (`assignedToId[]`)

---

## ⚙️ Infraestrutura AWS

- **Compute:** AWS ECS (Fargate) ou Lambda
- **Banco:** Aurora Serverless
- **Autenticação:** Cognito (Keycloak futuramente)
- **Cache:** Redis (ElastiCache)
- **Mensageria:** SQS/EventBridge
- **CI/CD:** GitHub Actions / AWS CodePipeline

---

## 🔐 Segurança

- HTTPS + criptografia em repouso
- Cookies HttpOnly (JWT)
- RBAC com @RoleGuard e @RolesGuard

---

## 📊 Observabilidade

- **Logs:** AWS CloudWatch
- **Tracing:** AWS X-Ray
- **Monitoramento opcional:** Datadog ou NewRelic

---

## ⚡️ Performance e Escalabilidade

- Auto-scaling com ECS Fargate
- Aurora com escalabilidade automática
- Redis para cache e sessões
- CDN com CloudFront

---

## 🔧 Ferramentas Adicionais

- **Infraestrutura como Código:** Terraform
- **CI/CD:** GitHub Actions / AWS CodePipeline
- **Padronização:** ESLint, Prettier, Husky, Lint-staged

---

## 🔹 Scripts Utilitários

```bash
# Rodar API local
pnpm --filter=api dev

# Rodar testes
pnpm --filter=api test

# Format code
pnpm format
```

---

## 📖 Monorepo

- `apps/api`: API NestJS
- `packages/zod`: Schemas e DTOs compartilhados
- `packages/typescript-config`: Configurações tsconfig compartilhadas

---

## 🔧 Requisitos

- Node 18+
- PNPM
- Docker (para banco local opcional)
- PostgreSQL / Prisma CLI
- Firebase CLI (para FCM)

---

> Projeto em andamento com foco em escalabilidade, boas práticas e separação de responsabilidades. Sinta-se à vontade para contribuir!

