# Angular-NestJS CQRS Monorepo

## Overview

This is an Nx-managed monorepo implementing a full-stack application with Angular (frontend) and NestJS (backend). The architecture follows **Clean Architecture** principles combined with **CQRS (Command Query Responsibility Segregation)** and **Event Sourcing** patterns.

### Core Principles

1. **Clean Architecture**: Separation of concerns across Domain, Application, and Infrastructure layers
2. **CQRS**: Commands for writes, Queries for reads, Events for notifications (using `@nestjs/cqrs`)
3. **Event Sourcing**: Events are the source of truth; state is derived by replaying events
4. **Test-Driven Development (TDD)**: Tests written first, primarily against the application layer
5. **Enforced Boundaries**: Module dependency rules enforced via ESLint
6. **State Management**: NGRX on frontend, Event Sourcing on backend

---

## Project Structure

```
angular-nest-starter/
├── apps/
│   ├── api/                    # NestJS backend application
│   │   └── src/
│   │       ├── app/
│   │       │   └── app.module.ts
│   │       └── main.ts
│   └── frontend/               # Angular frontend application
│       └── src/
│           ├── app/
│           │   ├── app.ts
│           │   ├── app.config.ts (NGRX configured here)
│           │   └── app.routes.ts
│           └── main.ts
├── packages/
│   ├── domain/                 # Domain layer (pure business logic)
│   ├── application/            # Application layer (CQRS handlers)
│   ├── infrastructure/         # Infrastructure layer (external services)
│   └── testing/                # Shared testing utilities
├── nx.json                     # Nx workspace configuration
├── tsconfig.base.json          # TypeScript path aliases
└── eslint.config.mjs           # Module boundary enforcement
```

---

## Architecture Layers

### 1. Domain Layer (`packages/domain/`)

**Purpose**: Contains pure business logic, entities, value objects, domain events, and business rules.

**Characteristics**:
- No external dependencies
- Framework-agnostic
- No infrastructure concerns
- Pure TypeScript classes and functions

**Dependencies**: Can only depend on itself

**Examples**:
```typescript
// packages/domain/src/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private password: string
  ) {}

  changePassword(newPassword: string): void {
    // Domain logic for password validation
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    this.password = newPassword;
  }
}

// packages/domain/src/value-objects/email.vo.ts
export class Email {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### 2. Application Layer (`packages/application/`)

**Purpose**: Orchestrates domain logic, implements CQRS handlers (commands, queries, events), and defines use cases.

**Characteristics**:
- Uses `@nestjs/cqrs` package
- Contains command handlers, query handlers, event handlers
- Orchestrates domain entities and services
- No direct infrastructure dependencies (uses ports/interfaces)

**Dependencies**: Can depend on `domain` and `application`

**Examples**:

```typescript
// packages/application/src/commands/create-user.command.ts
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

// packages/application/src/commands/handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserCreatedEvent } from '../../events/user-created.event';
import { IUserRepository } from '../../ports/user-repository.interface';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { email, password } = command;

    // Use domain logic
    const user = new User(generateId(), email, password);

    // Persist via repository interface
    await this.userRepository.save(user);

    // Publish domain event
    this.eventBus.publish(new UserCreatedEvent(user.id, user.email));

    return user.id;
  }
}

// packages/application/src/queries/get-user.query.ts
export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

// packages/application/src/queries/handlers/get-user.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { IUserRepository } from '../../ports/user-repository.interface';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: GetUserQuery): Promise<UserDto> {
    const user = await this.userRepository.findById(query.userId);
    return { id: user.id, email: user.email };
  }
}

// packages/application/src/events/user-created.event.ts
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {}
}

// packages/application/src/events/handlers/user-created.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    // Handle side effects (e.g., send welcome email, log analytics)
    console.log(`User created: ${event.email}`);
  }
}

// packages/application/src/ports/user-repository.interface.ts
export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
```

### 3. Infrastructure Layer (`packages/infrastructure/`)

**Purpose**: Implements ports/interfaces from the application layer, handles external services, databases, HTTP clients, and third-party integrations.

**Characteristics**:
- Implements repository interfaces
- Database access (TypeORM, Prisma, etc.)
- External APIs and services
- Framework-specific implementations

**Dependencies**: Can depend on `domain`, `application`, and `infrastructure`

**Examples**:
```typescript
// packages/infrastructure/src/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@application/ports/user-repository.interface';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  // Inject your database client here (e.g., TypeORM, Prisma)

  async save(user: User): Promise<void> {
    // Database persistence logic
  }

  async findById(id: string): Promise<User> {
    // Database query logic
  }

  async findByEmail(email: string): Promise<User | null> {
    // Database query logic
  }
}
```

### 4. Testing Layer (`packages/testing/`)

**Purpose**: Shared testing utilities, test helpers, mock factories, and test data builders.

**Characteristics**:
- Test utilities and helpers
- Mock factories for entities and services
- Test data builders
- Shared test fixtures

**Dependencies**: Can depend on all packages (for testing purposes)

**Examples**:
```typescript
// packages/testing/src/builders/user.builder.ts
import { User } from '@domain/entities/user.entity';

export class UserBuilder {
  private id = 'test-user-id';
  private email = 'test@example.com';
  private password = 'password123';

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  build(): User {
    return new User(this.id, this.email, this.password);
  }
}

// packages/testing/src/mocks/user-repository.mock.ts
import { IUserRepository } from '@application/ports/user-repository.interface';

export class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async findById(id: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }
}
```

---

## CQRS Implementation with NestJS

This project uses the `@nestjs/cqrs` package to implement CQRS patterns.

### Commands (Write Operations)

Commands represent **intent to change state**. They should be named in imperative form (e.g., `CreateUser`, `UpdateProfile`, `DeleteItem`).

**Structure**:
1. Define command class in `packages/application/src/commands/`
2. Implement handler in `packages/application/src/commands/handlers/`
3. Register handler in module providers
4. Execute via `CommandBus` in controllers

**Example**:
```typescript
// In NestJS controller (apps/api/)
import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@application/commands/create-user.command';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(dto.email, dto.password);
    const userId = await this.commandBus.execute(command);
    return { id: userId };
  }
}
```

### Queries (Read Operations)

Queries represent **requests for data**. They should be named as questions (e.g., `GetUser`, `FindAllUsers`, `GetUserByEmail`).

**Structure**:
1. Define query class in `packages/application/src/queries/`
2. Implement handler in `packages/application/src/queries/handlers/`
3. Register handler in module providers
4. Execute via `QueryBus` in controllers

**Example**:
```typescript
// In NestJS controller
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '@application/queries/get-user.query';

@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    return await this.queryBus.execute(query);
  }
}
```

### Events (Side Effects)

Events represent **something that has happened**. They should be named in past tense (e.g., `UserCreated`, `ProfileUpdated`, `ItemDeleted`).

**Structure**:
1. Define event class in `packages/application/src/events/`
2. Implement handler(s) in `packages/application/src/events/handlers/`
3. Register handlers in module providers
4. Publish via `EventBus` from command handlers

**Multiple handlers can listen to the same event** for different side effects.

### Sagas (Complex Workflows)

Sagas orchestrate complex workflows by listening to events and dispatching new commands.

**Example**:
```typescript
// packages/application/src/sagas/user.saga.ts
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserCreatedEvent } from '../events/user-created.event';
import { SendWelcomeEmailCommand } from '../commands/send-welcome-email.command';

@Injectable()
export class UserSaga {
  @Saga()
  userCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserCreatedEvent),
      map(event => new SendWelcomeEmailCommand(event.email))
    );
  };
}
```

### Module Registration

Register all CQRS components in a NestJS module:

```typescript
// apps/api/src/app/users/users.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';

// Import handlers
import { CreateUserHandler } from '@application/commands/handlers/create-user.handler';
import { GetUserHandler } from '@application/queries/handlers/get-user.handler';
import { UserCreatedHandler } from '@application/events/handlers/user-created.handler';
import { UserSaga } from '@application/sagas/user.saga';

// Import infrastructure
import { UserRepository } from '@infrastructure/repositories/user.repository';

const CommandHandlers = [CreateUserHandler];
const QueryHandlers = [GetUserHandler];
const EventHandlers = [UserCreatedHandler];
const Sagas = [UserSaga];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...Sagas,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
```

---

## Test-Driven Development (TDD)

### TDD Workflow

1. **Write the test first** in `packages/testing/`
2. **Run the test** - it should fail (red)
3. **Implement the minimum code** to pass the test
4. **Run the test again** - it should pass (green)
5. **Refactor** the code while keeping tests green
6. **Repeat** for next requirement

### Testing Strategy

**Primary Test Target**: Application layer (CQRS handlers)
**Testing Framework**: Vitest with `@analogjs/vitest-angular` for Angular components

### Test Organization

```
packages/testing/
└── src/
    ├── lib/
    │   ├── testing.ts                          # Shared utilities
    │   └── testing.spec.ts                     # Example test
    ├── builders/                                # Test data builders
    │   └── user.builder.ts
    ├── mocks/                                   # Mock implementations
    │   └── user-repository.mock.ts
    └── tests/
        ├── commands/                            # Command handler tests
        │   └── create-user.handler.spec.ts
        ├── queries/                             # Query handler tests
        │   └── get-user.handler.spec.ts
        └── events/                              # Event handler tests
            └── user-created.handler.spec.ts
```

### Testing Command Handlers

Command handler tests should verify:
- Domain logic is applied correctly
- Repository methods are called with correct arguments
- Events are published
- Error handling works as expected

**Example**:
```typescript
// packages/testing/src/tests/commands/create-user.handler.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus } from '@nestjs/cqrs';
import { CreateUserHandler } from '@application/commands/handlers/create-user.handler';
import { CreateUserCommand } from '@application/commands/create-user.command';
import { UserCreatedEvent } from '@application/events/user-created.event';
import { MockUserRepository } from '../../mocks/user-repository.mock';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let repository: MockUserRepository;
  let eventBus: EventBus;
  let publishedEvents: any[];

  beforeEach(() => {
    repository = new MockUserRepository();
    publishedEvents = [];
    eventBus = {
      publish: (event: any) => publishedEvents.push(event),
    } as any;

    handler = new CreateUserHandler(repository, eventBus);
  });

  it('should create a user with valid email and password', async () => {
    // Arrange
    const command = new CreateUserCommand('user@example.com', 'password123');

    // Act
    const userId = await handler.execute(command);

    // Assert
    expect(userId).toBeDefined();
    const savedUser = await repository.findById(userId);
    expect(savedUser.email).toBe('user@example.com');
  });

  it('should publish UserCreatedEvent after creating user', async () => {
    // Arrange
    const command = new CreateUserCommand('user@example.com', 'password123');

    // Act
    await handler.execute(command);

    // Assert
    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0]).toBeInstanceOf(UserCreatedEvent);
    expect(publishedEvents[0].email).toBe('user@example.com');
  });

  it('should throw error for invalid email', async () => {
    // Arrange
    const command = new CreateUserCommand('invalid-email', 'password123');

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow('Invalid email format');
  });
});
```

### Testing Query Handlers

Query handler tests should verify:
- Correct data is returned
- Repository queries are called correctly
- Not found scenarios are handled
- Data transformation is correct

**Example**:
```typescript
// packages/testing/src/tests/queries/get-user.handler.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserHandler } from '@application/queries/handlers/get-user.handler';
import { GetUserQuery } from '@application/queries/get-user.query';
import { MockUserRepository } from '../../mocks/user-repository.mock';
import { UserBuilder } from '../../builders/user.builder';

describe('GetUserHandler', () => {
  let handler: GetUserHandler;
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
    handler = new GetUserHandler(repository);
  });

  it('should return user by id', async () => {
    // Arrange
    const user = new UserBuilder()
      .withId('user-123')
      .withEmail('test@example.com')
      .build();
    await repository.save(user);

    const query = new GetUserQuery('user-123');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
    });
  });

  it('should throw error when user not found', async () => {
    // Arrange
    const query = new GetUserQuery('non-existent-id');

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow('User not found');
  });
});
```

### Testing Event Handlers

Event handler tests should verify:
- Side effects are executed correctly
- External services are called with correct data
- Error handling for side effects

**Example**:
```typescript
// packages/testing/src/tests/events/user-created.handler.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserCreatedHandler } from '@application/events/handlers/user-created.handler';
import { UserCreatedEvent } from '@application/events/user-created.event';

describe('UserCreatedHandler', () => {
  let handler: UserCreatedHandler;
  let emailService: any;

  beforeEach(() => {
    emailService = {
      sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
    };
    handler = new UserCreatedHandler(emailService);
  });

  it('should send welcome email when user is created', async () => {
    // Arrange
    const event = new UserCreatedEvent('user-123', 'new@example.com');

    // Act
    await handler.handle(event);

    // Assert
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('new@example.com');
  });
});
```

### Running Tests

```bash
# Run all tests
nx run-many -t test

# Run tests for specific package
nx test testing

# Run tests in watch mode
nx test testing --watch

# Run tests with coverage
nx test testing --coverage
```

---

## Module Boundaries & Dependency Rules

ESLint enforces architectural boundaries defined in `eslint.config.mjs`:

| Layer            | Can Depend On                                    |
|------------------|--------------------------------------------------|
| `domain`         | `domain` only                                    |
| `application`    | `application`, `domain`                          |
| `infrastructure` | `infrastructure`, `application`, `domain`        |
| `testing`        | All packages (for testing purposes)              |
| `api` (backend)  | `api`, `application`, `infrastructure`, `domain` |
| `frontend`       | `frontend` only (isolated)                       |

**Example Error**:
```typescript
// ❌ This will fail ESLint validation
// In packages/domain/src/entities/user.entity.ts
import { Injectable } from '@nestjs/common'; // WRONG: Domain cannot depend on framework

// ✅ Correct
// Domain layer uses pure TypeScript
export class User {
  // Pure domain logic
}
```

---

## Development Guidelines

### Creating a New Feature

Follow this workflow when adding a new feature:

1. **Write tests first** (TDD) in `packages/testing/`
2. **Define domain entities** in `packages/domain/`
3. **Create CQRS components** in `packages/application/`:
   - Commands for write operations
   - Queries for read operations
   - Events for notifications
   - Handlers for each
4. **Implement infrastructure** in `packages/infrastructure/`:
   - Repository implementations
   - External service integrations
5. **Wire up in NestJS modules** in `apps/api/`
6. **Create API endpoints** in controllers
7. **Integrate with frontend** via NGRX

### Code Placement Guidelines

| What                      | Where                                      |
|---------------------------|--------------------------------------------|
| Business entities         | `packages/domain/src/entities/`            |
| Value objects             | `packages/domain/src/value-objects/`       |
| Domain services           | `packages/domain/src/services/`            |
| Commands                  | `packages/application/src/commands/`       |
| Command handlers          | `packages/application/src/commands/handlers/` |
| Queries                   | `packages/application/src/queries/`        |
| Query handlers            | `packages/application/src/queries/handlers/` |
| Events                    | `packages/application/src/events/`         |
| Event handlers            | `packages/application/src/events/handlers/` |
| Sagas                     | `packages/application/src/sagas/`          |
| Port interfaces           | `packages/application/src/ports/`          |
| Repository implementations| `packages/infrastructure/src/repositories/` |
| External services         | `packages/infrastructure/src/services/`    |
| NestJS modules            | `apps/api/src/app/*/`                      |
| Controllers               | `apps/api/src/app/*/`                      |
| Test utilities            | `packages/testing/src/lib/`                |
| Test builders             | `packages/testing/src/builders/`           |
| Mocks                     | `packages/testing/src/mocks/`              |
| Tests                     | `packages/testing/src/tests/`              |

### Naming Conventions

**Commands**: `{Verb}{Noun}Command` (e.g., `CreateUserCommand`, `UpdateProfileCommand`)
**Queries**: `Get{Noun}Query` or `Find{Noun}Query` (e.g., `GetUserQuery`, `FindUsersByRoleQuery`)
**Events**: `{Noun}{PastTenseVerb}Event` (e.g., `UserCreatedEvent`, `ProfileUpdatedEvent`)
**Handlers**: `{CommandOrQueryOrEvent}Handler` (e.g., `CreateUserHandler`, `GetUserHandler`)
**Tests**: `{HandlerName}.spec.ts` (e.g., `create-user.handler.spec.ts`)

---

## Frontend-Backend Integration

### Basic Pattern

**Frontend (NGRX)** → **HTTP Request** → **Backend (NestJS Controller)** → **CQRS Command/Query** → **Handler**

### Example Flow

1. **User action in Angular component** triggers NGRX action:
   ```typescript
   // Frontend
   this.store.dispatch(UserActions.createUser({ email, password }));
   ```

2. **NGRX Effect** makes HTTP call:
   ```typescript
   createUser$ = createEffect(() =>
     this.actions$.pipe(
       ofType(UserActions.createUser),
       exhaustMap(action =>
         this.http.post('/api/users', action).pipe(
           map(response => UserActions.createUserSuccess({ userId: response.id })),
           catchError(error => of(UserActions.createUserFailure({ error })))
         )
       )
     )
   );
   ```

3. **NestJS Controller** receives request and dispatches command:
   ```typescript
   @Post()
   async createUser(@Body() dto: CreateUserDto) {
     const command = new CreateUserCommand(dto.email, dto.password);
     const userId = await this.commandBus.execute(command);
     return { id: userId };
   }
   ```

4. **Command Handler** processes the command:
   ```typescript
   @CommandHandler(CreateUserCommand)
   export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
     async execute(command: CreateUserCommand): Promise<string> {
       // Handle business logic
     }
   }
   ```

5. **NGRX Reducer** updates state with success action:
   ```typescript
   on(UserActions.createUserSuccess, (state, { userId }) => ({
     ...state,
     users: [...state.users, { id: userId }],
   }))
   ```

---

## Event Sourcing Architecture

This project uses **Event Sourcing** as the persistence mechanism, where state changes are stored as a sequence of events rather than current state snapshots. Events are the source of truth; aggregate state is derived by replaying events.

### Key Concepts

**Event Sourcing** means:
- ✅ Events are the source of truth (persisted to event store)
- ✅ Aggregate state is derived by replaying events
- ✅ Complete audit trail of all changes
- ✅ Time travel and debugging capabilities
- ✅ Projections for read models

### Core Components

#### 1. Domain Events

Domain events are immutable records of things that have happened. They contain only business data (payload), not infrastructure concerns.

```typescript
// Domain aggregates raise pure events
{
  type: 'ContactRegistered',
  payload: {
    contactId: 'contact-123',
    firstName: 'John',
    lastName: 'Doe',
    source: 'LinkedIn'
  }
}
```

#### 2. Aggregates

Aggregates are event-sourced entities that:
- Raise events when business operations occur
- Apply events to update their internal state
- Track uncommitted events for persistence
- Maintain version for optimistic concurrency control

```typescript
// packages/domain/src/common/events/aggregate.ts
export abstract class Aggregate {
  private _version: number = 0;
  private _uncommittedEvents: { type: string; payload: object }[] = [];

  abstract apply(event: { type: string; payload: object }): void;

  protected raise(event: { type: string; payload: object }): void {
    this.apply(event);  // Update internal state
    this._uncommittedEvents.push(event);  // Track for persistence
  }

  uncommittedEvents(): { type: string; payload: object }[] {
    return this._uncommittedEvents;
  }

  baseVersion(): number {
    return this._version;  // Version of last persisted state
  }

  markAllAsCommitted(): void {
    this._version += this._uncommittedEvents.length;
    this._uncommittedEvents = [];
  }

  protected loadFromHistory(events: DomainEvent[]): void {
    events.forEach((event) => {
      this.apply({ type: event.type, payload: event.payload });
      this._version = event.version;
    });
  }
}
```

#### 3. Event Enrichment

Aggregates raise pure domain events. The repository enriches them with infrastructure fields before persistence:

```typescript
// Repository enriches events automatically
async save(aggregate: Contact): Promise<void> {
  const uncommittedEvents = aggregate.uncommittedEvents();

  // Enrich with infrastructure fields (id, version, timestamps, userId, tenantId)
  const enrichedEvents = this.enrichEvents(
    uncommittedEvents,
    aggregate.id.value(),
    aggregate.baseVersion()
  );

  // Persist to event store
  await this.eventStore.append(enrichedEvents);

  aggregate.markAllAsCommitted();
}
```

#### 4. Command Handler Pattern

Command handlers orchestrate the workflow:

```typescript
@CommandHandler(RegisterContact)
export class RegisterContactHandler implements ICommandHandler<RegisterContact> {
  constructor(private readonly contacts: ContactRepository) {}

  async execute(command: RegisterContact): Promise<ContactId> {
    const contactId = new ContactId();

    // Aggregate raises events
    const contact = Contact.register(contactId, ...command.data);

    // Repository enriches and persists events
    await this.contacts.save(contact);

    return contactId;
  }
}
```

### Repository Interface

```typescript
// packages/domain/src/repositories/contact.repository.ts
export interface ContactRepository {
  save(contact: Contact): Promise<void>;
  load(id: ContactId): Promise<Contact>;
}
```

### Event Store Structure

```typescript
// packages/domain/src/common/events/domain-event.ts
export type DomainEvent = {
  id: string;              // Unique event ID
  streamId: string;        // Aggregate ID
  type: string;            // Event type
  version: number;         // Event version in stream (for concurrency)
  created: string;         // ISO timestamp
  payload: object;         // Business data
  metadata: object;        // Contextual data (correlation IDs, etc.)
  userId?: string;         // User who triggered (for multi-tenancy)
  tenantId?: string;       // Tenant ID (for multi-tenancy)
};
```

### Optimistic Concurrency Control

Version numbers prevent concurrent modifications:

```typescript
// Repository checks version on save
const expectedVersion = aggregate.baseVersion();
const actualVersion = existingEvents.length;

if (expectedVersion !== actualVersion) {
  throw new ConcurrencyException(
    `Expected version ${expectedVersion}, got ${actualVersion}`
  );
}
```

### Benefits

1. **Complete Audit Trail**: Every change is recorded as an event
2. **Time Travel**: Reconstruct aggregate state at any point in time
3. **Event Replay**: Rebuild read models or fix bugs by replaying events
4. **Temporal Queries**: Ask questions about the past ("Was this contact active in Q2?")
5. **Integration**: Other systems can subscribe to event stream
6. **Debugging**: See exact sequence of events that led to current state

---

## Best Practices

### Do's ✅

- Write tests BEFORE implementation (TDD)
- Keep domain layer pure (no framework dependencies)
- Use interfaces (ports) in application layer, implement in infrastructure
- Make commands and queries immutable
- Name events in past tense
- Use value objects for domain concepts
- **Aggregates raise events** (domain layer), repositories enrich and persist them (infrastructure layer)
- Keep command handlers simple - they orchestrate aggregates and repositories
- Aggregates should not know about userId, tenantId, or other infrastructure concerns
- Keep handlers focused (Single Responsibility Principle)
- Use builders and mocks from testing package

### Don'ts ❌

- Don't put business logic in controllers or infrastructure
- Don't import infrastructure code into domain or application layers
- Don't make commands or queries have behavior (they're just data)
- Don't use queries to modify state
- Don't catch errors in handlers unless you can handle them meaningfully
- Don't skip tests because "it's simple code"
- Don't violate module boundaries (ESLint will catch this)
- Don't put tests in app or domain packages (use testing package)

---

## Useful Commands

```bash
# Development
nx serve api                  # Start backend (port 3000)
nx serve frontend             # Start frontend (port 4200)

# Testing
nx test testing               # Run tests
nx test testing --watch       # Watch mode
nx test testing --coverage    # With coverage

# Linting
nx lint api                   # Lint backend
nx lint frontend              # Lint frontend
nx run-many -t lint           # Lint all projects

# Building
nx build api                  # Build backend
nx build frontend             # Build frontend
nx run-many -t build          # Build all projects

# Code generation
nx g @nx/nest:module users apps/api/src/app
nx g @nx/nest:controller users apps/api/src/app/users
nx g @nx/nest:service users apps/api/src/app/users
```

---

## Additional Resources

- [NestJS CQRS Documentation](https://docs.nestjs.com/recipes/cqrs)
- [Nx Documentation](https://nx.dev)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing by Martin Fowler](https://martinfowler.com/eaaDev/EventSourcing.html)

---

## Questions or Issues?

This document should serve as the primary reference for understanding the codebase architecture and development practices. If you have questions or find areas needing clarification, please update this document to help future developers.
