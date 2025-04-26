# TypeORM

### Entity

- Notes
    - Every entity must appear in `TypeOrmModule.forFeature([ … ])`

- Class Members
    - `@Column(c_options?)`
    - `@PrimaryGeneratedColumn(strategy?, options?)`
    - `@ManyToOne(typeFn_target, r_options?)`
    - `@JoinColumn(j_options?)` / `@JoinColumns([j_options…])`
    - `@OneToMany(typeFn_targets, inverse_owner?, r_options?)`

- Options
    - **ColumnOptions**  
        - `type`: `int` \| `varchar` \| `decimal` \| `timestamp` \| …  
        - `length`, `precision`, `scale`  
        - `nullable`, `unique`, `default`, `name`, `select`, `insert`, `update`
    - **RelationOptions**  
        - `eager` (always load)  
        - `cascade` (auto persist)  
        - `nullable`, `onDelete`, `onUpdate`, `persistence`, `orphanedRowAction`
    - **JoinColumnOptions**  
        - `name` (FK column name)  
        - `referencedColumnName` (PK name in target)

---

# Controller (`@Controller(path?)`)

- Notes
    - Put `@UsePipes(...)` under `@Controller` to apply validation pipes to all handlers
    - Put `@UsePipes(...)` under a single HTTP decorator to apply pipes to that handler
    - Pass pipes directly into parameter decorators (e.g. `@Param('id', ParseIntPipe)`)

- HTTP Decorators
    - `@Get(path?)`
    - `@Post(path?)`
    - `@Patch(path?)`
    - `@Put(path?)`
    - `@Delete(path?)`

- Parameter Decorators
    - `@Req()` – raw request object  
    - `@Res()` – raw response object  
    - `@Body()` – entire request body  
    - `@Body('name')` – single property from body  
    - `@Param(name)` – route path parameters  
    - `@Query(name?)` – query-string parameters  
    - `@Headers(name?)` – request headers  
    - `@Ip()` – client IP address  
    - `@Session()` – session object  
    - `@Cookies(name?)` – cookie values  
    - `@HostParam(name?)` – VHost route parameters  
    - `@HttpCode(status)` – override default response status

- Order for multiple method decorators
    1. HTTP decorator (`@Get`, `@Post`, etc.)  
    2. `@HttpCode(...)` (if needed)  
    3. Parameter decorators

- Pipes
    - `ValidationPipe`
    - `ParseIntPipe`, `ParseBoolPipe`, `ParseUUIDPipe`
    - `DefaultValuePipe`, `ParseArrayPipe`

- `ValidationPipe` Options
    - `whitelist` – strip unknown properties  
    - `forbidNonWhitelisted` – throw on unknown props  
    - `transform` – auto-transform payloads to DTO instances  

---

# Service (`@Injectable(options?)`)

- Notes
    - `@Injectable()` encapsulates business logic & data access  
    - Registered as a provider in its module

- `@Injectable(options?)`
    - Marks the class so Nest’s DI container can instantiate it  
    - `options.scope`: `DEFAULT` (singleton) \| `REQUEST` \| `TRANSIENT`

- Dependency Injection
    - `@InjectRepository(Entity)` → `private repo: Repository<Entity>`
    - Constructor-injected services → `private readonly otherService: OtherService`

- Provider Scopes
    - **Singleton** – one shared instance  
    - **Request** – one instance per incoming request  
    - **Transient** – new instance each injection

- Advanced
    - Circular dependencies → `forwardRef(() => OtherService)`  
    - Transactions → `@Transaction()` or manual `QueryRunner`  
    - Exceptions → throw `BadRequestException`, `NotFoundException`, etc.

---

# Module (`@Module(metadata)`)

- Notes
    - Groups controllers, providers, imports, exports into a feature area  
    - Defines DI scope and what’s visible to other modules

- `@Module({ … })` metadata
    - `imports: any[]`  
        - Other modules or `TypeOrmModule.forFeature([...])`  
        - Brings in exported providers for injection
    - `controllers: any[]`  
        - Controller classes handling incoming requests
    - `providers: any[]`  
        - Injectable services, custom providers, pipes, guards, interceptors
    - `exports: any[]`  
        - Subset of this module’s providers to expose to importing modules

- Advanced
    - Dynamic modules → `.forRoot()`, `.forFeature()` patterns  
    - Circular module imports → use `forwardRef(() => OtherModule)`  
    - Global modules → `@Global()` decorator for app-wide providers  
