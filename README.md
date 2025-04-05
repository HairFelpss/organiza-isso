# Organiza Isso - Plataforma de Agendamento

Organiza Isso é uma aplicação fullstack moderna para agendamento de serviços com prestadores. Este repositório segue um monorepo com organização em pacotes (Zod, configurações de TS) e aplicações (API REST NestJS).

---

## 💻 Monorepo com Turborepo

Este projeto utiliza o [Turborepo](https://turbo.build/repo) para organização de apps e pacotes compartilhados:

### Aplicativos (apps)
- `api`: Backend NestJS
- `web`: Frontend Web (Next.js)
- `docs`: Documentação (Next.js)

### Pacotes (packages)
- `@organiza-isso-app/zod`: Schemas e validações compartilhadas (Zod)
- `@organiza-isso-app/ui`: Componentes React reutilizáveis
- `@organiza-isso-app/eslint-config`: Configuração de ESLint compartilhada
- `@organiza-isso-app/typescript-config`: `tsconfig.json` centralizado

---

## 💡 Tecnologias Utilizadas

- **Monorepo:** Turborepo + PNPM workspaces
- **Backend:** NestJS, Prisma ORM, Zod, JWT
- **Frontend Web:** Next.js (React)
- **Mobile:** React Native (Expo)
- **Infra:** AWS (ECS Fargate, Aurora, SES, S3, CloudFront, Cognito)

---

## 🚀 Estrutura da API REST

```
/api/v1
  ├── /auth           # login, registro, refresh
  ├── /users          # perfil, gerenciamento
  ├── /professionals   # agenda pública, horários
  ├── /appointments   # reservas, lista de espera
  └── /notifications  # envio de push/email
```

---

## 🚀 Funcionalidades

### Web (Next.js)
- Horários disponíveis dos prestadores
- Painel de gerenciamento de agenda
- Autenticação JWT com cookies HttpOnly

### Mobile (React Native)
- Agendamento intuitivo
- Visualização de agenda e horários
- Notificações push (Firebase)

---

## 📆 Banco de Dados

- **Database:** AWS Aurora PostgreSQL Serverless
- **ORM:** Prisma ORM
- **Cache:** Redis (ElastiCache)

### Estrutura principal:
```
Users: id, email, password, role
Professionals: id, userId, specialties
Appointments: id, providerId, clientId, scheduleId, status
Notifications: id, userId, type, message, deliveredAt
Schedule: id, professionalId, dateTime, isAvailable
```

---

## 📨 Notificações
- **Push:** Firebase Cloud Messaging (FCM)
- **Emails:** AWS SES

---

## 💼 Armazenamento e CDN
- **Arquivos:** Amazon S3
- **Distribuição:** AWS CloudFront

---

## ⚖️ Fluxo de Reserva

1. Cliente acessa agenda de um prestador
2. Agenda ou entra em lista de espera
3. Verificação em tempo real
4. Reserva gera notificação
5. Fila é atualizada automaticamente

---

## ⚙️ Infraestrutura AWS Recomendada

- **Compute:** ECS Fargate ou Lambda
- **Auth:** Cognito (posteriormente Keycloak)
- **Mensageria:** SQS ou EventBridge
- **CDN & Armazenamento:** CloudFront + S3
- **Deploy CI/CD:** GitHub Actions / AWS CodePipeline

---

## 🔒 Segurança
- HTTPS + criptografia de dados
- JWT via cookies HttpOnly
- RBAC com `@RoleGuard`

---

## 📊 Observabilidade
- AWS CloudWatch, AWS X-Ray
- Integração com Datadog / NewRelic (opcional)

---

## 🚡 Performance e Escalabilidade
- Auto-scaling (ECS Fargate)
- Prisma com Aurora Serverless
- Cache Redis para sessões e dados
- CDN para conteúdo estático

---

## 🔧 Ferramentas de Dev
- ESLint + Prettier + Husky
- Zod para validação
- `nestjs-zod` para pipe validation
- Terraform (IaC)

---

## ⚒️ Comandos úteis

```bash
# Build do projeto
pnpm build

# Dev local (API, Web, etc)
pnpm dev

# Testes automatizados
pnpm --filter=api test

# Formatador
pnpm format
```

---

## ☑️ Requisitos de Desenvolvimento
- Node 18+
- PNPM
- Docker (opcional para DB local)
- Prisma CLI
- Firebase CLI (notificações)

---

## 🔗 Links úteis
- [Turborepo Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Zod](https://github.com/colinhacks/zod)
- [Prisma](https://www.prisma.io/docs/)
- [NestJS](https://docs.nestjs.com/)

---

> Projeto em evolução constante! Contribuições e sugestões são bem-vindas. ✨
