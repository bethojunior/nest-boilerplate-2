# NestJS Boilerplate

Boilerplate completo para aplicações NestJS com suporte a filas (BullMQ), eventos (Event Emitter), autenticação JWT, Prisma ORM e muito mais.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Redis](https://redis.io/)** - Cache e gerenciamento de filas
- **[BullMQ](https://docs.bullmq.io/)** - Sistema de filas baseado em Redis
- **[Event Emitter](https://docs.nestjs.com/techniques/events)** - Sistema de eventos assíncronos
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[Passport](http://www.passportjs.org/)** - Middleware de autenticação
- **[Docker](https://www.docker.com/)** - Containerização
- **[Class Validator](https://github.com/typestack/class-validator)** - Validação de DTOs
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Yarn ou npm
- Docker e Docker Compose
- PostgreSQL (ou usar via Docker)
- Redis (ou usar via Docker)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd nest-boilerplate-2
```

2. Instale as dependências:
```bash
yarn install
# ou
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Application
APP_PORT=3002

# Database
DATABASE_URL="postgresql://root:password@localhost:5432/mydatabase?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=3600
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
# ou
yarn prisma migrate dev
```

5. (Opcional) Execute o seed para popular o banco:
```bash
yarn seed
# ou
npm run seed
```

## 🐳 Docker

### Desenvolvimento

Para subir apenas os serviços de infraestrutura (PostgreSQL e Redis):

```bash
make up-dev
```

Para derrubar os serviços:

```bash
make down-dev
```

### Produção

Para buildar e subir todos os containers (app + infraestrutura):

```bash
make docker-build-and-up
```

Para rebuildar e subir os containers:

```bash
make docker-re-build-and-up
```

## 🏃 Executando a aplicação

### Desenvolvimento

```bash
# Modo watch (recompila automaticamente)
yarn dev
# ou
npm run dev
```

### Produção

```bash
# Build
yarn build

# Iniciar
yarn start:prod
# ou
npm run start:prod
```

## 📁 Estrutura do Projeto

```
src/
├── @shared/              # Código compartilhado
│   ├── entities/         # Entidades do domínio
│   ├── events/           # Eventos do sistema
│   ├── exceptions/       # Exceções customizadas
│   ├── helpers/          # Funções auxiliares
│   └── interceptors/     # Interceptadores
├── @types/               # Definições de tipos TypeScript
├── consts/               # Constantes
├── decorators/           # Decoradores customizados
├── jobs/                 # Jobs e filas
│   └── queues/
│       └── email/        # Fila de emails
├── modules/              # Módulos da aplicação
│   └── auth/            # Módulo de autenticação
├── providers/            # Provedores de serviços
│   ├── notification/    # Provedores de notificação
│   └── prisma/          # Cliente Prisma
└── main.ts              # Arquivo principal
```

## 🔐 Autenticação

O projeto inclui um sistema completo de autenticação JWT:

- **POST** `/auth/register` - Registro de novo usuário
- **POST** `/auth/login` - Login e obtenção de token JWT

### Protegendo rotas

Use o decorator `@UseGuards(JwtAuthGuard)` para proteger rotas:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  // Suas rotas protegidas
}
```

## 📨 Filas (BullMQ)

O projeto está configurado com BullMQ para processamento assíncrono de jobs.

### Exemplo de uso

```typescript
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MyService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async sendEmail(data: any) {
    await this.emailQueue.add('send-email', data);
  }
}
```

## 🎯 Event Emitter

Sistema de eventos assíncronos para comunicação entre módulos:

### Emitindo eventos

```typescript
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MyService {
  constructor(private eventEmitter: EventEmitter2) {}

  async doSomething() {
    this.eventEmitter.emit('notification.discord.notify', {
      content: 'Mensagem de notificação'
    });
  }
}
```

### Escutando eventos

```typescript
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MyEventHandler {
  @OnEvent('notification.discord.notify')
  async handleEvent(payload: { content: string }) {
    // Processar evento
  }
}
```

## 🗄️ Prisma

### Gerar cliente Prisma

```bash
npx prisma generate
```

### Criar nova migração

```bash
npx prisma migrate dev --name nome_da_migracao
```

### Visualizar banco de dados

```bash
npx prisma studio
```

## 🧪 Testes

```bash
# Testes unitários
yarn test

# Testes em modo watch
yarn test:watch

# Cobertura de testes
yarn test:cov

# Testes E2E
yarn test:e2e
```

## 📝 Scripts Disponíveis

- `yarn build` - Compila o projeto
- `yarn start` - Inicia a aplicação
- `yarn dev` - Inicia em modo desenvolvimento (watch)
- `yarn start:prod` - Inicia em modo produção
- `yarn lint` - Executa o linter
- `yarn format` - Formata o código com Prettier
- `yarn test` - Executa os testes
- `yarn seed` - Popula o banco de dados

## 🔧 Configurações

### Validação Global

O projeto utiliza `ValidationPipe` globalmente com as seguintes configurações:
- `whitelist: true` - Remove propriedades não definidas no DTO
- `forbidNonWhitelisted: true` - Retorna erro para propriedades não permitidas
- `transform: true` - Transforma automaticamente os objetos recebidos

### CORS

CORS está habilitado globalmente. Configure no arquivo `main.ts` conforme necessário.

### Exceções Customizadas

O projeto inclui um sistema de exceções customizadas com `BusinessException` e filtros globais para tratamento de erros.

## 📦 Dependências Principais

### Produção
- `@nestjs/bullmq` - Integração BullMQ
- `@nestjs/event-emitter` - Sistema de eventos
- `@nestjs/jwt` - Autenticação JWT
- `@nestjs/passport` - Autenticação
- `@prisma/client` - Cliente Prisma
- `bullmq` - Sistema de filas
- `ioredis` - Cliente Redis
- `bcrypt` - Hash de senhas
- `class-validator` - Validação
- `zod` - Validação de schemas

### Desenvolvimento
- `@nestjs/cli` - CLI do NestJS
- `@typescript-eslint/*` - Linting TypeScript
- `prettier` - Formatação de código
- `jest` - Framework de testes

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença UNLICENSED.

## 👨‍💻 Autor

Desenvolvido como boilerplate para projetos NestJS.

---

**Nota**: Este é um projeto boilerplate. Certifique-se de configurar adequadamente as variáveis de ambiente e ajustar as configurações de segurança antes de usar em produção.
